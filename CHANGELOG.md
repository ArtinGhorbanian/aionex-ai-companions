# Changelog

This file records notable changes to AIONEX: Your Personal AI Companions. The project is an
experimental proprietary preview and does not yet promise stable APIs or data
migrations.

## [0.1.0] - 2026-08-08

### Added

- Local Flask dashboard with five selectable companion personas.
- Streamed AI chat responses, conversation history, conversation deletion, and
  Markdown/code presentation in the browser.
- Local SQLite persistence for conversations, messages, inferred memory facts,
  and generated shared-memory summaries.
- Privacy-first memory opt-in, memory inspection, and per-fact deletion controls.
- Conversation summarization, mood analysis, daily check-in, text-to-speech,
  and moderation-assisted message handling through the OpenAI API.
- Theme preferences and multilingual interface text for the included language
  choices.
- Environment-based local configuration and a safe example configuration.
- Repository linting, tests, dependency auditing, dependency updates, CodeQL
  analysis, and community contribution templates.
- Architecture, privacy, security, support, roadmap, case-study, copyright, and
  third-party documentation.

### Security

- Kept OpenAI credentials and Flask secret material out of source-controlled
  configuration.
- Classified the SQLite database, environment files, logs, and generated local
  data as private runtime artifacts.
- Documented the absence of authentication and the requirement to keep the
  development server local.
- Added loopback host/origin checks, bounded inputs and workers, sanitized
  Markdown rendering, security headers, and owner-scoped local records.

### Known limitations

- Single local user context with no authentication, authorization, or tenant
  isolation.
- Plaintext local SQLite storage with no migration or backup system.
- OpenAI API access and network connectivity are required for AI features and
  may create usage charges.
- Pinned browser libraries are loaded from external content delivery services.
- In-process background work is not durable across restarts.
- The Flask development server is not suitable for production deployment.
