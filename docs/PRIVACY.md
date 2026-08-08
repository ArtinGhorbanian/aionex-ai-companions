# Privacy notes

## Purpose

This document explains the data behavior visible in AIONEX: Your Personal AI Companions v0.1.0.
It is technical guidance for a local demonstration, not a general privacy
policy, regulatory-compliance claim, or promise suitable for a hosted service.

The application has no accounts or authentication. It assumes one trusted user
running both browser and server on the same machine. Do not enter another
person's private information or use the application for confidential,
regulated, clinical, financial, legal, employment, or emergency data.

## Data inventory

| Location or recipient | Data involved | Purpose |
| --- | --- | --- |
| Browser `localStorage` | Theme, language, personal-memory opt-in, and per-persona last-visit date | Restore interface preferences and daily check-in behavior |
| Local SQLite database | Conversation titles, persona choice, messages, timestamps, inferred memory facts, and generated shared-memory summaries | Conversation continuity and personalization |
| OpenAI API | Feature-dependent prompts that may contain a message, recent or full conversation context, local memory facts, selected persona/language, text for speech, and generated output | Moderation, chat, memory extraction, summaries, mood analysis, check-ins, and speech |
| Third-party content delivery services | Normal web request metadata when scripts and styles load | Deliver pinned Marked and Highlight.js resources |
| Local console | Operational or error information | Development diagnostics |

The repository does not implement application analytics, advertising trackers,
or an account profile system. External resource providers and the OpenAI API may
process standard network and account metadata under their own current terms and
settings; that processing is outside this codebase's control.

## What is sent to the OpenAI API

Different actions expose different context:

- A chat sends the user's new message for moderation and sends a bounded recent
  history, persona instruction, and language preference for response generation.
  Available memory facts are included only when personal memory is enabled.
- When personal memory is enabled, memory extraction sends recent conversation
  content and may persist returned structured facts locally.
- Shared-memory generation runs only when personal memory is enabled.
  Conversation summarization sends a bounded representation of stored content
  whenever the user requests it.
- Mood analysis sends user-authored content from the selected conversation.
- Daily check-in generation sends the persona and language; it includes local
  memory context only when personal memory is enabled.
- Text-to-speech sends the text selected for audio generation.

Do not assume that choosing a fictional persona changes provider processing or
creates confidentiality. Review the provider account's current data controls,
retention behavior, geographic processing, and usage terms before use.

## Storage and retention

Local conversation and memory data remain in the configured SQLite file until
the user deletes records or removes that file. No automatic retention period,
expiry job, encrypted storage, backup service, or secure-erasure mechanism is
implemented.

The browser retains preferences, the memory opt-in, and last-visit dates until site data is cleared.
Generated speech is returned to the browser and is not intentionally stored by
the application, though browser, operating-system, proxy, or provider caches may
behave independently.

Error output may exist in terminal history or captured logs. Review diagnostic
material before sharing it. Never publish a database, `.env` file, conversation
transcript, or screenshot containing private data.

## User controls

- Delete a conversation through the history interface to remove its local
  conversation record, messages, and linked shared memory under the current
  schema.
- Leave personal memory disabled (the default), or enable and disable future
  memory processing at any time from Settings. Disabling it does not erase
  facts already stored.
- Review inferred memory facts in Settings and delete individual facts.
- Clear browser site data to remove saved theme, language, and visit dates.
- For complete local reset, stop the server and remove the configured ignored
  SQLite database only after deciding that no backup is needed.

Deletion from the active SQLite tables does not guarantee forensic erasure from
database pages, filesystem snapshots, backups, logs, or device storage. Local
deletion also cannot remove information already processed or retained by an
external API provider. Use the provider's own controls for provider-side
requests.

## Known privacy limitations

- A fixed local-user context means all callers share the same conversation and
  memory namespace.
- Any process or person able to read the database file can read its plaintext
  contents.
- Any person able to reach the unauthenticated server may be able to retrieve,
  change, or delete local data.
- Inferred memory can be incomplete, incorrect, overly sensitive, or broader
  than the user intended.
- Model prompts can combine current content with previously inferred facts.
- Remotely loaded browser resources reveal ordinary connection metadata and add
  supply-chain dependencies.
- The opt-in is a browser preference, not a server-side consent record. There is
  no age assurance, data-export package, bulk-memory deletion endpoint,
  retention scheduler, or administrator audit trail.

## Safer local evaluation

1. Run only on a trusted device and loopback interface.
2. Use synthetic or low-sensitivity conversation content.
3. Use a restricted development API key and keep `.env` ignored.
4. Keep personal memory off unless you want it; review stored facts regularly
   and delete unwanted items.
5. Do not share the machine account or expose the server over a network.
6. Treat model responses and inferred facts as unverified.
7. Remove local data when evaluation is complete, accounting for backups and
   provider-side controls separately.

Any future hosted or multi-user edition needs a dedicated privacy policy,
lawful-purpose review, authentication, tenant isolation, minimization,
retention/deletion controls, provider agreements, incident procedures, and
jurisdiction-specific assessment before collecting real user data.
