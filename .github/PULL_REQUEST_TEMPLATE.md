## Purpose

Describe the problem and the outcome of this change. Link the relevant issue
when one exists.

## Scope

- What changed?
- What intentionally did not change?
- Are routes, configuration, data handling, or user-visible behavior affected?

## Verification

List the exact commands and manual checks you ran, with honest results.

- [ ] `python -m ruff check .`
- [ ] `python -m pytest -q`
- [ ] Relevant manual flow checked with synthetic content
- [ ] Documentation updated where behavior or limitations changed

Use "not applicable" with a short explanation for checks that do not apply.

## Security and privacy

- [ ] No credential, `.env` file, local database, log, generated audio, private
      conversation, personal data, or identifying machine path is included.
- [ ] New or changed request data is validated at the Flask boundary.
- [ ] OpenAI/provider data exposure is unchanged or documented below.
- [ ] Dependency and third-party attribution changes are documented.
- [ ] The change does not present the local demo as authenticated,
      internet-safe, or production-ready.

Explain any security, privacy, data-retention, external-service, or licensing
impact:

## Interface evidence

For meaningful UI changes, include before/after screenshots with synthetic
content and no private browser or machine details. Otherwise state that this
section is not applicable.

## Contributor confirmation

- [ ] I have the right to submit this work and agree to the contribution terms
      in `CONTRIBUTING.md`.
- [ ] I reviewed the complete diff and did not hide or disable a failing check.
