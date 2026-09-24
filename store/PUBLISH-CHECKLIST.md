# Publishing No AI Feed 1.3.2

## Decision and release gates

Goal: prepare a Chrome Web Store submission for the existing extension, preserving the compact English/Arabic interface. This is release preparation, not automatic public publication.

| Gate | Passing condition |
| --- | --- |
| Package | MV3, valid summary/version/icons, manifest at ZIP root, runtime files only |
| Behavior | Rules, exceptions, reveal/hide, on/off, persistence and rescan work |
| Permissions/privacy | Narrow permissions; disclosures match local processing and metadata requests |
| Listing/assets | Accurate claims; real current UI screenshots; correct asset dimensions |
| Publisher | Registered/verified account; factual distribution and trader declarations |

Assumptions: Chrome Web Store first; existing name and proprietary license; free personal use. No publisher email, store item ID, account registration status, trader status or geographic restrictions were supplied. Those facts must not be invented. Broader store launches and a UI redesign are outside this release.

## Prepared fields

- Name: No AI Feed
- Primary language: English; Arabic UI and separate Arabic listing copy included.
- Suggested category: Productivity / Workflow & Planning (choose the closest available dashboard label).
- Website: https://github.com/Ibrahim-3d/No-AI-Feed
- Support: https://github.com/Ibrahim-3d/No-AI-Feed/issues
- Privacy: updated public PRIVACY.md after merge.
- Pricing: free, personal non-commercial use under the existing license.
- Visibility recommendation: Unlisted for the initial reviewed release, then Public after a live-site smoke test. Both undergo review.
- Distribution: all regions unless the publisher has an actual restriction; confirm trader/non-trader status truthfully in the dashboard.
- Promotional video: no fabricated URL; omit if the dashboard permits.

## Final sequence

1. Review the release changes and test the unpacked release on current Facebook and YouTube. See QA.md for what was and was not verified here.
2. Merge the release PR so the public privacy URL is current. If an existing Web Store version is already 1.3.2 or higher, increment the version and rebuild before uploading.
3. Open https://chrome.google.com/webstore/devconsole and use the correct publisher account. Register/pay the displayed one-time fee if needed; enable two-step verification and verify the contact email. Complete any required identity/trader verification yourself.
4. Create a new item, or update the existing item if it already exists. Upload ONLY `dist/no-ai-feed-1.3.2-chrome.zip`, not the full publishing-kit ZIP or GitHub source archive.
5. Paste LISTING-EN.txt; add Arabic localization if available for the uploaded locales. Upload the 128 px icon, 440×280 promo tile, and 1280×800 screenshots. Optional marquee: 1400×560.
6. Complete privacy fields using PRIVACY-FIELDS.md and the current public privacy URL. Personally confirm the certification statements.
7. Paste REVIEWER-INSTRUCTIONS.txt. Set chosen visibility/regions.
8. Choose deferred publishing if desired, then submit for review. Submission and public publication have not been performed by this preparation task.
9. After approval, install the store build, repeat the short live-site test, then publish/promote. Record the assigned store URL and item ID in README for future updates.

## Official references (checked September 24, 2026)

- https://developer.chrome.com/docs/webstore/prepare
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/best-listing
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
- https://developer.chrome.com/docs/webstore/register
- https://developer.chrome.com/docs/webstore/set-up-account
- https://developer.chrome.com/docs/webstore/program-policies/two-step-verification
- https://developer.chrome.com/docs/webstore/cws-dashboard-distribution
- https://developer.chrome.com/docs/webstore/publish
