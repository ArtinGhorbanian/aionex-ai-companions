import sqlite3

import pytest

import app as aionex


@pytest.fixture()
def app_module(tmp_path, monkeypatch):
    database_path = tmp_path / "aionex-test.db"
    monkeypatch.setattr(aionex, "DB_NAME", str(database_path))
    monkeypatch.setattr(aionex, "_openai_client", None)
    aionex.app.config.update(TESTING=True)
    aionex.setup_database()
    yield aionex
    aionex._openai_client = None


@pytest.fixture()
def client(app_module):
    return app_module.app.test_client()


@pytest.fixture()
def seeded_conversations(app_module):
    connection = app_module.get_db_connection()
    own_cursor = connection.execute(
        "INSERT INTO conversations (user_id, persona_name, title, timestamp) VALUES (?, ?, ?, ?)",
        (app_module.LOCAL_USER_ID, "AURA", "Owned conversation", app_module.utc_now()),
    )
    other_cursor = connection.execute(
        "INSERT INTO conversations (user_id, persona_name, title, timestamp) VALUES (?, ?, ?, ?)",
        ("another-local-user", "AURA", "Other conversation", app_module.utc_now()),
    )
    connection.execute(
        "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (own_cursor.lastrowid, "user", "Hello", app_module.utc_now()),
    )
    connection.execute(
        "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (other_cursor.lastrowid, "user", "Private", app_module.utc_now()),
    )
    connection.commit()
    connection.close()
    return own_cursor.lastrowid, other_cursor.lastrowid


@pytest.fixture()
def sqlite_integrity_error():
    return sqlite3.IntegrityError
