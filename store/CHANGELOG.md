# 1.3.2 release preparation

- Shortened the store summary and added English/Arabic manifest localization.
- Removed unnecessary activeTab permission and broad *.facebook.com host access; kept supported page hosts and Facebook media CDN access.
- Removed service-worker logic that repeatedly re-added default topics into personal settings. AI terms remain in built-in keyword lists, including on Facebook.
- Facebook exceptions now bypass labels and metadata as well as keyword matches.
- A reveal action clears both built-in and personal treatments; personal rules respond to Rescan.
- Excluded injected YouTube overlays from text/signature matching; recycled content resets temporary reveal state.
- Restricted metadata messages to this extension's Facebook content scripts and HTTPS Facebook/CDN URLs, disallowed URL credentials and redirects, omitted referrer, added an eight-second timeout and enforced a 2 MiB stream cap.
- Hid the unconfigured donation button and clarified that quick-add creates a topic/phrase rule.
- Updated privacy policy, supplied store declarations/reviewer instructions, created current UI listing graphics and deterministic packaging plus regression checks.

The existing name, compact layout, proprietary license and local-only filtering approach remain in place.
