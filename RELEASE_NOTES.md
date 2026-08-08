# AIONEX: Your Personal AI Companions v0.1.0

The first public preview of AIONEX brings five character-led AI experiences into one local, privacy-conscious Flask application. Version 0.1.0 is an experimental, single-user release for evaluation on a trusted workstation; it is not a hosted service or production deployment.

## Highlights

- Five themed companions: Aura, Zane, Lyra, Rex, and Nova.
- Streamed conversations with local history and conversation deletion.
- Personal memory disabled by default, with explicit opt-in, visible facts, and per-fact deletion.
- Conversation summaries, mood reflection, shared memories, daily check-ins, and text-to-speech.
- English, Spanish, French, Arabic, Chinese, and Hindi interface and response options.
- Responsive light/dark interface with keyboard, reduced-motion, and RTL support.

## Security and reliability

- Server-side environment configuration with ignored local secrets and database files.
- Loopback-only startup, debug mode off by default, host/origin checks, bounded inputs, and security headers.
- Owner-scoped local record queries, SQLite integrity settings, and bounded background workers.
- Allowlist-sanitized Markdown output and exact browser dependency pins with integrity hashes.
- Automated tests, Ruff, Bandit, pip-audit, CodeQL, and Dependabot configuration.

## Install

Use GitHub's **Code** menu to clone the repository, create a Python 3.10–3.13 virtual environment, install `requirements.txt`, copy `.env.example` to `.env`, and add your own OpenAI API key plus a unique Flask secret. Run with:

```bash
python app.py
```

Then open `http://127.0.0.1:5000`.

## Important limitations

- One trusted local user; no authentication, authorization, or tenant isolation.
- Plaintext local SQLite storage with no automatic retention, encryption, export, or bulk deletion.
- OpenAI API connectivity is required for AI features and may incur provider charges.
- No rate limit, spend control, production WSGI server, durable queue, or public-hosting configuration.
- Marked and Highlight.js load from pinned third-party CDN resources.

Read the [README](README.md), [privacy notes](docs/PRIVACY.md), and [security policy](SECURITY.md) before evaluation.

## Upgrade notes

This is the initial public release. No migration from an earlier public version is required. Existing private development databases are intentionally excluded and should not be copied into a public repository.

Built by AIONEX.
