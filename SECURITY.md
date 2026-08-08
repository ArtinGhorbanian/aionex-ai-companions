# Security policy

AIONEX: Your Personal AI Companions is an experimental, local, single-user demonstration. It
has no authentication or authorization layer and is not ready for production,
internet-facing deployment, shared machines, or sensitive conversations.

## Supported versions

| Version | Security updates |
| --- | --- |
| 0.1.x | Current preview line |
| Earlier or unversioned copies | Not supported |

Support means that reports may be assessed against the current preview. It does
not imply a response-time commitment, security certification, or warranty.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting flow in the repository Security
area when it is available. Include:

- the affected version or commit;
- the relevant route, component, or configuration;
- reproducible steps using synthetic data;
- impact and realistic preconditions;
- a minimal proof of concept; and
- a suggested mitigation, if known.

Never include API keys, tokens, real conversations, local databases, personal
data, or unredacted machine paths. If private vulnerability reporting is not
available, open a minimal issue asking AIONEX to establish a private reporting
channel; do not disclose exploit details in that issue.

Please allow time for triage before public disclosure. AIONEX may confirm the
report, reproduce it, prepare a fix, and coordinate disclosure, but no service
level or bounty is promised.

## Security boundaries in v0.1.0

- There are no accounts, login controls, or authenticated user isolation.
  Record queries may be scoped to the configured local-user identifier, but that
  identifier is not proof of identity. Anyone who can reach the server can act
  as the local user.
- Conversation messages, inferred memory facts, and summaries are stored in an
  unencrypted local SQLite file.
- Conversation content is sent to the configured OpenAI API for applicable AI
  features. Provider handling is outside this repository's control.
- Browser dependencies are loaded from third-party content delivery
  services, creating additional network and supply-chain trust boundaries.
- The Flask development server is intended for loopback-only evaluation. Do not
  expose it to a LAN or the public internet.
- Model moderation and a local keyword check are defense-in-depth controls, not
  guarantees that output will be safe, accurate, or appropriate.
- AI-generated Markdown is rendered in the browser. Treat model output as
  untrusted content and review rendering changes carefully.

Before testing, use a restricted API key intended for development, review its
usage limits, and keep it only in the ignored local environment file. Test only
systems and data you own or are authorized to assess.

## Operational guidance

- Keep `.env` and the SQLite database untracked and private.
- Bind only to a loopback address for local use.
- Keep debug mode disabled unless actively diagnosing on a trusted machine.
- Rotate any credential that has been exposed; removing it from Git does not
  make it safe again.
- Review dependency alerts and automated update pull requests before merging.
- Do not use the application for medical, financial, legal, emergency, or other
  high-stakes decisions.
