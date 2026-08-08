from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_every_markdown_render_flows_through_allowlist_sanitizer():
    script = (ROOT / "static" / "script.js").read_text(encoding="utf-8")
    assert "sanitizeMarkdownHtml" in script
    assert "ALLOWED_MARKDOWN_TAGS" in script
    assert script.count("marked.parse") == 1
    assert "sanitizeMarkdownHtml(window.marked.parse" in script


def test_frontend_dependencies_are_exactly_pinned_with_integrity():
    template = (ROOT / "templates" / "dashboard.html").read_text(encoding="utf-8")
    assert "marked@18.0.9" in template
    assert "highlight.js/11.11.1" in template
    assert template.count('integrity="sha384-') == 3
    assert "cdn.jsdelivr.net/npm/marked/marked.min.js" not in template


def test_local_database_and_legacy_artwork_are_ignored():
    ignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
    for expected in (".env", "memory.db", "*.db", "static/AIONEX.jpg", "static/speaker-filled-audio-tool.png"):
        assert expected in ignore
