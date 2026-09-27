# No AI Feed 1.3.2 — Chrome Web Store launch

**Status:** Live on the Chrome Web Store  
**Store:** https://chromewebstore.google.com/detail/no-ai-feed/fkohiolphgncfcihlegdmdnjgmfmigmi

Version 1.3.2 is the first release documented here as a publicly distributed Chrome Web Store build.

## What's new

- Added English/Arabic manifest localization and finalized the compact bilingual popup.
- Added personal topic/phrase rules plus creator, page and channel filtering.
- Added exceptions that can keep content visible even when another rule matches.
- Added blur/reveal and complete-hide behavior with rescan support.
- Expanded YouTube filtering across Home, search, subscriptions/channel grids, watch recommendations and Shorts cards.
- Kept the built-in AI-topic filters while fixing personal-rule behavior when AI filtering is disabled.

## Reliability and privacy improvements

- Removed unnecessary `activeTab` permission and narrowed supported Facebook host access.
- Prevented deleted personal filters from being silently re-seeded.
- Fixed Facebook exceptions so they bypass supported labels/metadata as well as keyword matches.
- Fixed reveal behavior when built-in and personal filters both match the same item.
- Excluded injected YouTube overlays from text/signature matching.
- Restricted metadata messages to the extension's Facebook content scripts and supported HTTPS Facebook/CDN URLs.
- Metadata requests omit credentials/referrer, refuse redirects, use an eight-second timeout and enforce a 2 MiB stream cap.
- No analytics, advertising trackers, remote AI services or remotely executed code are used.

## Known limits

No AI Feed is a rule-based filter, not a general AI-content detector. It can miss unlabeled content and can match human discussion of AI. Results depend on visible text, available labels/metadata and current platform DOM structure.

## Installation

Install the public build from the [Chrome Web Store](https://chromewebstore.google.com/detail/no-ai-feed/fkohiolphgncfcihlegdmdnjgmfmigmi).

The repository also keeps the deterministic v1.3.2 package under `dist/` for transparency and manual inspection.
