# Release verification — No AI Feed 1.3.2

Prepared September 24, 2026 from upstream main `ca0c99fad1198f743bd062c402fc8d03e40623a9`.

## Completed

- Node syntax checks for every shipped JavaScript file.
- Six Node background tests: no storage writes/reseed on worker restart, allowed-media URL boundaries, metadata sensitivity/negative case, streaming cap when Range is ignored, sender restrictions, and credential/referrer/redirect request settings.
- Chromium 153.0.8010.0 renders the real popup HTML/CSS/JS at 380×540 in English and Arabic; primary, Manage and Advanced screenshots inspected. Popup saves a topic rule and metadata toggle through mocked Chrome storage APIs.
- Both Facebook and YouTube DOM fixtures execute the shipped content scripts. Checked single-click reveal with dual matches, exceptions, complete hiding, restore on disable, personal filtering with AI detectors off, and personal rescan. No uncaught page errors. Machine-readable results: browser-results.json.
- ZIP integrity, root manifest, runtime references, localized summary lengths, and all expected icon files verified. Package contains runtime/localization/license only, no tests or listing assets. SHA256SUMS.txt records the exact ZIP hash.
- Store graphics use screenshots of the current popup with example settings. Connection responses were supplied by the fixture, not recorded from a live Facebook/YouTube session. They do not claim live-platform validation. Four 1280×800 listing images, a 440×280 tile, a 1400×560 marquee and a 128×128 icon are included.

## Remaining gate before submitting

A complete installed-extension test on desktop Chrome against current Facebook and YouTube is still required. The available Chromium runtime rendered and executed DOM tests but did not start an extension service worker in the installed-extension probe; therefore it does not establish installation, Chrome permission behavior, real metadata network responses or live-platform selector compatibility. No account credentials were used or requested.

Follow REVIEWER-INSTRUCTIONS.txt with the unpacked release. Verify a fresh install and an update from 1.3.1, supported-tab connection with narrowed permissions, actual media requests, and that removed custom rules stay removed after restarting Chrome. Site layouts differ by account and language. Claims about metadata remain best effort; detection accuracy has not been benchmarked.

No Web Store account, registration, existing item/version, trader declaration or submission status was verified. No submission or public store publication occurred.

## Reproduce

- `npm install` (development tooling only; no dependencies ship in the extension).
- `npm test`
- Install a compatible Chromium/Chrome or run `npx playwright install chromium`.
- `CHROME_BIN=/absolute/path/to/chrome npm run test:browser` (omit CHROME_BIN for Playwright's installed browser).
- `CHROME_BIN=/absolute/path/to/chrome npm run assets`
- `npm run package`

Tests deliberately distinguish local logic/DOM checks from a live integration test.
