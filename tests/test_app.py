from types import SimpleNamespace

import pytest


def test_index_health_and_security_headers(client):
    index_response = client.get("/")
    assert index_response.status_code == 200
    assert b"AIONEX: Your Personal AI Companions" in index_response.data
    assert "default-src 'self'" in index_response.headers["Content-Security-Policy"]
    assert index_response.headers["X-Content-Type-Options"] == "nosniff"
    assert index_response.headers["X-Frame-Options"] == "DENY"

    health_response = client.get("/api/health")
    assert health_response.status_code == 200
    assert health_response.get_json()["status"] == "ok"
    assert health_response.headers["Cache-Control"] == "no-store"


def test_rejects_untrusted_host_and_cross_origin(client):
    assert client.get("/api/health", headers={"Host": "attacker.example"}).status_code == 400
    response = client.post(
        "/api/chat",
        json={"message": "Hello", "persona": "AURA"},
        headers={"Origin": "http://localhost:9000"},
    )
    assert response.status_code == 403


@pytest.mark.parametrize(
    "path",
    [
        "/api/chat",
        "/api/tts",
        "/api/summarize",
        "/api/analyze_mood/1",
        "/api/daily_checkin",
    ],
)
def test_post_endpoints_reject_non_object_json(client, path):
    response = client.post(path, data="null", content_type="application/json")
    assert response.status_code == 400
    assert response.is_json


def test_chat_validation_happens_before_any_provider_call(client, app_module):
    invalid_persona = client.post(
        "/api/chat",
        json={"message": "Hello", "persona": "UNKNOWN", "lang": "en"},
    )
    assert invalid_persona.status_code == 400
    assert invalid_persona.get_json()["error"] == "Unknown persona."

    oversized = client.post(
        "/api/chat",
        json={"message": "x" * (app_module.MAX_MESSAGE_CHARS + 1), "persona": "AURA", "lang": "en"},
    )
    assert oversized.status_code == 400


def test_conversation_access_is_scoped_to_local_user(client, seeded_conversations):
    own_id, other_id = seeded_conversations
    assert client.get(f"/api/conversation/{own_id}").status_code == 200
    assert client.get(f"/api/conversation/{other_id}").status_code == 404
    assert client.delete(f"/api/conversation/{other_id}").status_code == 404
    assert client.delete(f"/api/conversation/{own_id}").status_code == 200


def test_foreign_keys_are_enabled_on_every_connection(app_module, sqlite_integrity_error):
    connection = app_module.get_db_connection()
    with pytest.raises(sqlite_integrity_error):
        connection.execute(
            "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            (999_999, "user", "orphan", app_module.utc_now()),
        )
    connection.close()


class FakeExecutor:
    def __init__(self):
        self.submissions = []

    def submit(self, *_args, **_kwargs):
        self.submissions.append((_args, _kwargs))
        return None


class FakeOpenAIClient:
    def __init__(self):
        self.moderations = SimpleNamespace(create=self._moderate)
        self.chat = SimpleNamespace(completions=SimpleNamespace(create=self._chat))

    @staticmethod
    def _moderate(**_kwargs):
        return SimpleNamespace(results=[SimpleNamespace(flagged=False)])

    @staticmethod
    def _chat(**kwargs):
        if kwargs.get("stream"):
            return iter(
                [
                    SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(content="Hello "))]),
                    SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(content="there"))]),
                ]
            )
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content="{}"))])


def test_chat_stream_contract_and_persistence(client, app_module, monkeypatch):
    executor = FakeExecutor()
    monkeypatch.setattr(app_module, "_openai_client", FakeOpenAIClient())
    monkeypatch.setattr(app_module, "BACKGROUND_EXECUTOR", executor)

    response = client.post(
        "/api/chat",
        json={"message": "Hello", "persona": "AURA", "lang": "en"},
    )
    body = response.get_data(as_text=True)

    assert response.status_code == 200
    assert response.mimetype == "text/event-stream"
    assert "event: conversation_id" in body
    assert '"content": "Hello "' in body
    assert '"content": "there"' in body
    assert "event: end_stream" in body

    connection = app_module.get_db_connection()
    roles = [row[0] for row in connection.execute("SELECT role FROM messages ORDER BY id")]
    connection.close()
    assert roles == ["user", "assistant"]
    assert executor.submissions == []


def test_chat_requires_boolean_memory_preference(client, app_module, monkeypatch):
    monkeypatch.setattr(app_module, "_openai_client", FakeOpenAIClient())
    response = client.post(
        "/api/chat",
        json={"message": "Hello", "persona": "AURA", "memory_enabled": "yes"},
    )
    assert response.status_code == 400
    assert response.get_json()["error"] == "Memory preference must be a boolean."


def test_runtime_config_reports_only_actionable_labels(app_module, monkeypatch):
    monkeypatch.setattr(app_module, "OPENAI_API_KEY", "")
    monkeypatch.setattr(app_module, "FLASK_SECRET_KEY", "short")
    errors = app_module.validate_runtime_config()
    assert len(errors) == 2
    assert all("=" not in error for error in errors)
