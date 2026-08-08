# Support

AIONEX: Your Personal AI Companions is an early local demonstration, not a hosted service or a
production-supported product. Community assistance is best-effort and has no
guaranteed response time.

## Choose the right channel

- Use the **Question** issue form for setup or usage questions.
- Use the **Bug report** form for reproducible defects.
- Use the **Feature request** form for a proposed improvement.
- Use the **Commercial inquiry** form for a high-level project adaptation or
  licensing discussion. Because issues are public, do not include confidential
  requirements, budgets, customer information, or proprietary documents.
- Use the private process in [SECURITY.md](SECURITY.md) for vulnerabilities.

Before opening an issue, check existing issues and the project documentation.
Include the application version, Python version, operating system family,
minimal reproduction steps, and exact error text after redacting credentials,
conversation content, personal data, and local path details.

## Supported scope

Support may cover local installation, environment configuration, documented
features, reproducible defects, and contribution questions for the current
preview. It does not cover:

- public hosting or production operations;
- third-party API availability, billing, quotas, or account decisions;
- recovery of deleted or corrupted local data;
- custom deployment, authentication, or multi-user design work through a bug
  report;
- medical, financial, legal, crisis, or emergency advice; or
- unsupported forks and heavily modified copies.

## Quick checks

1. Confirm Python 3.10-3.13 is active in the intended virtual environment.
2. Reinstall the pinned runtime requirements.
3. Confirm `.env` exists locally and contains your own valid development values
   without posting them.
4. Confirm the server is accessed only through its documented loopback address.
5. Reproduce with a fresh ignored database when data preservation is not
   required.
6. Run `python -m pytest -q` and `python -m ruff check .` before reporting a code
   regression.

Do not attach a local SQLite database or `.env` file to an issue.
