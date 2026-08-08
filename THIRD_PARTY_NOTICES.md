# Third-party notices

AIONEX: Your Personal AI Companions is proprietary software, but it depends on third-party
software and services. Those components remain governed by their own licenses
and terms. AIONEX does not claim ownership of them.

This file is a practical inventory of directly used components, not a legal
opinion or a complete substitute for the license files shipped by each package.
Installed package distributions and the dependency manifests are authoritative
for the exact versions in use. Preserve their notices when redistributing an
authorized copy.

## Python runtime dependencies

| Component | Use in this project | License identified by the component |
| --- | --- | --- |
| Flask | Web application, routing, requests, responses, and templates | BSD 3-Clause |
| python-dotenv | Loads local environment configuration during development | BSD 3-Clause |
| OpenAI Python SDK | Client for chat, moderation, speech, and related OpenAI API calls | Apache License 2.0 |

These packages may install transitive dependencies with separate licenses. An
authorized distributor must review the resolved environment and reproduce all
notices required by those dependencies.

## Browser-loaded dependencies

| Component | Use in this project | License identified by the component |
| --- | --- | --- |
| Marked | Parses model Markdown in the browser | MIT |
| Highlight.js | Applies syntax highlighting to rendered code | BSD 3-Clause |

The current interface loads these libraries from third-party content delivery
services rather than storing their source in this repository. If they are
vendored, bundled, cached for redistribution, or modified later, include their
complete applicable license and copyright notices with the distributed copy.

## Inline SVG symbols

The HTML and JavaScript contain small project-embedded inline SVG interface
symbols made from basic paths and geometric shapes. The repository does not
contain reliable evidence tying these symbols to a particular external icon
library, so no exact external source or authorship is asserted here. Their
provenance should be reviewed before reusing them outside this project. If a
third-party lineage is later identified, preserve the applicable credit and
license or replace the symbols with verified original assets.

## OpenAI services and models

OpenAI-hosted APIs and models are external services, not included in this
repository and not licensed by the AIONEX proprietary license. Use requires the
operator's own account and is subject to the provider's then-current terms,
policies, availability, quotas, and charges.

## Notice maintenance

Before an authorized release or redistribution:

1. resolve the exact dependency versions;
2. inspect direct and transitive package metadata;
3. retain complete license and copyright files where required;
4. review newly added code, media, fonts, datasets, and model assets; and
5. update this notice when a dependency, delivery method, or provenance record
   changes.
