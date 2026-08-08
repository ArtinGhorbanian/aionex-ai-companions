# Roadmap

AIONEX: Your Personal AI Companions is at v0.1.0: a local, single-user demonstration of
persona-based conversation, streaming responses, and user-controlled local
memory. The items below are directions for evaluation, not release promises or
committed dates.

## Near-term quality and safety

- Expand route, validation, database, and OpenAI failure-path tests.
- Extend configured local-user record-scoping tests across every derived-data
  operation.
- Reduce reliance on remotely loaded browser assets.
- Add explicit database schema migration and recovery guidance.
- Improve structured, privacy-preserving error reporting without logging user
  content.
- Complete independent screen-reader, contrast, responsive, and localization
  verification.

## Before any shared or hosted use

- Design real authentication, session lifecycle, authorization, and per-user
  data isolation.
- Add CSRF protections where browser credentials are introduced, request-size
  controls, abuse limits, and deployment-aware security headers.
- Replace the development server and in-process background threads with a
  reviewed deployment and durable job architecture.
- Select a production datastore, encryption approach, backup policy, retention
  policy, audit strategy, and deletion workflow.
- Define operational monitoring, incident response, dependency governance, and
  provider data-processing requirements.
- Perform a threat model, privacy review, accessibility review, and independent
  security assessment for the intended environment.

## Product exploration

- Add export, correction, bulk deletion, server-side consent records, and
  retention controls for opt-in memory.
- Add model and provider configuration only where behavior can be tested and
  privacy implications are clear.
- Improve conversation search, organization, and portability.
- Add transparent cost and token-use feedback for API-backed features.
- Evaluate domain-specific persona packages for authorized client use cases,
  with appropriate safety boundaries and human oversight.

Roadmap priorities may change as testing, security review, dependency changes,
and user feedback reveal better choices.
