# Contributing to AIONEX: Your Personal AI Companions

Thank you for helping improve this AIONEX project. The repository is
proprietary, so contributions are reviewed selectively and do not change the
license of the project.

## Before starting

For a bug, feature proposal, or substantial change, open the matching issue
template first. Keep security reports out of public issues and follow
[SECURITY.md](SECURITY.md). Do not include confidential business information in
a commercial inquiry.

Good contributions are focused, maintain the local-demo scope, and include
verification proportional to the change. Avoid broad rewrites or new external
services without prior discussion.

## Local setup

Use Python 3.10 through 3.13:

```text
python -m venv .venv
python -m pip install --upgrade pip
python -m pip install -r requirements.txt -r requirements-dev.txt
```

Activate the virtual environment using the command appropriate for your shell.
Copy `.env.example` to `.env` only for manual application testing, then supply
your own development credentials. The automated test suite must not require a
real OpenAI key.

Run the checks used by continuous integration:

```text
python -m ruff check .
python -m pytest -q
python -m bandit -q -r app.py
python -m pip_audit --requirement requirements.txt
```

Continuous integration installs `pip-audit` explicitly before the last command.
Never weaken a check or hide a failure merely to make a pull request pass.

## Engineering expectations

- Keep server behavior compatible with the documented local single-user model.
- Validate untrusted request data at the Flask boundary.
- Use parameterized SQL and close connections reliably.
- Never log conversation bodies, extracted facts, credentials, or full local
  paths.
- Keep secrets in environment variables and preserve safe missing-key behavior.
- Add or update tests for behavior changes and regressions.
- Keep UI changes keyboard-accessible, responsive, and readable in supported
  themes and languages.
- Update user-facing documentation when commands, data handling, routes, or
  limitations change.

## Pull requests

A pull request should contain one coherent change and explain:

1. the problem and chosen approach;
2. user-visible and compatibility effects;
3. security and privacy effects;
4. exact checks run and their results; and
5. screenshots for meaningful visual changes, using synthetic content only.

Do not commit `.env`, databases, logs, generated audio, local caches, or personal
data. Review the complete diff before submission.

## Contribution rights

Only submit work that you have the right to provide. By submitting a
contribution, you represent that it is your original work or is accompanied by
all required permissions and notices. You retain copyright in your
contribution, while granting AIONEX a perpetual, worldwide, non-exclusive,
royalty-free license to use, reproduce, modify, distribute, sublicense, and
otherwise incorporate it into this project and related AIONEX offerings.

If you cannot grant these rights, do not submit the contribution. AIONEX may
decline, revise, or discontinue a contribution and makes no commitment to merge
or release it.
