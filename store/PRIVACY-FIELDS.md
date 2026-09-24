# Chrome Web Store privacy fields — 1.3.2

## Single purpose (paste)

Filter unwanted Facebook posts and YouTube video cards using local rules for AI-related topics, phrases, creators, platform labels, and available Facebook media metadata, with user-controlled blur, hide, and exceptions.

## Permission justifications (paste into matching fields)

**storage:** Save filtering preferences, language, personal topic and creator rules, and exceptions on the user's device using chrome.storage.local. No Chrome Sync or remote database is used.

**Facebook hosts (www.facebook.com, web.facebook.com, m.facebook.com):** Run content scripts on supported Facebook pages to read feed text, labels, source names and media links, and blur or hide matching posts. Supported tab URLs are read only to show connection status and enable the current-source shortcut. The worker can fetch Facebook-hosted media for the user-controlled metadata detector.

**YouTube hosts (www.youtube.com, m.youtube.com, youtube.com):** Run content scripts on supported YouTube pages to match visible video-card titles, text and channel names against local rules, then blur or hide matching cards. The popup checks the current supported tab and can offer a current-channel shortcut. No video/transcript download.

**https://*.fbcdn.net/*:** Fetch supported Facebook media referenced by the page for local provenance/metadata checks when enabled. Requests omit credentials/referrer and refuse redirects. Reads are limited to 2 MiB per media response with an eight-second timeout. Media is not uploaded to the developer or another service.

**Remote code:** No. All executable JavaScript is included in the extension ZIP. Downloaded media bytes are parsed as data and never evaluated.

## Data-use disclosures

Do not claim that local processing means the extension handles no user data. Google's current User Data FAQ explicitly includes locally processed data.

Select the applicable categories in the current dashboard:

- **Website content:** rendered feed text, labels, titles, source names, media links and supported media metadata, used locally for filtering.
- **Web history / browsing activity:** current supported page and media URLs used locally to operate the feature; no browser-history API, browsing log or unrelated-site monitoring.
- **Personally identifiable information:** creator/page/channel names and usernames read from the page or saved by the user in a source rule. No account signup, identity profiling, or transmission to the developer.

Do not select health, financial/payment, authentication, location or personal-communication collection as extension features. The code does not intentionally extract these categories. Feed text can incidentally contain arbitrary user-generated information; it is not categorized or retained as sensitive records. User activity such as click tracking, keystroke logging or mouse logging is not performed.

Certifications supported by the audited implementation:

- User data is not sold or transferred to third parties outside allowed cases.
- User data is not used or transferred for purposes unrelated to the extension's single purpose.
- User data is not used or transferred to determine creditworthiness or for lending.

Read the current dashboard wording before personally certifying it. The developer receives no telemetry. Facebook/CDN receives normal network requests for optional metadata fetching. Voluntary GitHub support issues are separate from automatic extension handling.

## Privacy URL

After merging the prepared changes: https://github.com/Ibrahim-3d/No-AI-Feed/blob/main/PRIVACY.md

Use the updated policy from the release branch until merged; do not pair new disclosures with an outdated policy. The repository is public, so this URL does not need a separate hosting service.

## Source

Verified September 24, 2026:
https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
https://developer.chrome.com/docs/webstore/program-policies/limited-use
