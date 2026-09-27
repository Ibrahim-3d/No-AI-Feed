# Release verification — No AI Feed 1.3.2

**Current release status:** Version 1.3.2 is live on the Chrome Web Store: https://chromewebstore.google.com/detail/no-ai-feed/fkohiolphgncfcihlegdmdnjgmfmigmi

The validation below was prepared on September 24, 2026 from upstream main `ca0c99fad1198f743bd062c402fc8d03e40623a9`. It is preserved as the **pre-publication QA record** for the build rather than as the current publishing status.

## Completed in the recorded QA pass

- Node syntax checks for every shipped JavaScript file.
- Six Node background tests: no storage writes/reseed on worker restart, allowed-media URL boundaries, metadata sensitivity/negative case, streaming cap when Range is ignored, sender restrictions, and credential/referrer/redirect request settings.
- Chromium 153.0.8010.0 rendered the real popup HTML/CSS/JS at 380×540 in English and Arabic; primary, Manage and Advanced screenshots were inspected. The popup saved a topic rule and metadata toggle through mocked Chrome storage APIs.
- Both Facebook and YouTube DOM fixtures executed the shipped content scripts. Checks covered single-click reveal with dual matches, exceptions, complete hiding, restore on disable, personal filtering with AI detectors off, and personal rescan. No uncaught page errors were recorded. Machine-readable results: `browser-results.json`.
- ZIP integrity, root manifest, runtime references, localized summary lengths and expected icon files were verified. The package contains runtime/localization/license only, without tests or listing assets. `SHA256SUMS.txt` records the exact ZIP hash.
- Store graphics use screenshots of the current popup with example settings. Connection responses were supplied by a fixture, not captured from a live Facebook/YouTube session.

## Limitation of that QA pass

The automated environment did **not** establish a complete installed-extension test against live Facebook and YouTube. Its Chromium probe did not start the extension service worker, so that specific pass did not validate Chrome permission behavior, real metadata network responses or live-platform selector compatibility.

That limitation describes the recorded automated test session. It does not mean the extension is unpublished; v1.3.2 is now publicly distributed through the Chrome Web Store.

Platform layouts can still change by account, locale and over time. Metadata detection remains best effort and its detection accuracy has not been benchmarked.

## Reproduce the repository checks

- `npm install`
- `npm test`
- Install a compatible Chromium/Chrome or run `npx playwright install chromium`.
- `CHROME_BIN=/absolute/path/to/chrome npm run test:browser` (omit `CHROME_BIN` for Playwright's installed browser).
- `CHROME_BIN=/absolute/path/to/chrome npm run assets`
- `npm run package`

Tests deliberately distinguish local logic/DOM checks from live integration testing.
