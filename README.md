# No AI Feed

**Take AI out of your feed.**

No AI Feed is a local-first Chrome extension that filters AI-related content from Facebook. It can detect Meta/Facebook AI labels, inspect media metadata/provenance, and filter posts using customizable AI/topic keywords. Matching posts can either be blurred or removed completely.

> **Current platform:** Facebook  
> **Roadmap:** Instagram, X/Twitter, LinkedIn, Reddit, YouTube, and other feed-based platforms.

## What it does

No AI Feed gives you three independent detection layers:

### 1. Facebook / Meta AI labels
Detects visible AI-related labels and disclosures in Facebook posts, including signals such as:

- AI info
- Made with AI
- Imagined with AI
- AI-generated / synthetic-media disclosures
- Supported Arabic AI-label patterns

### 2. Media metadata
Optionally checks metadata/provenance embedded in post media for AI-generation signals, including:

- AI provenance markers such as `trainedAlgorithmicMedia`
- generator/tool names stored in metadata
- creator/software metadata indicating generative AI
- EXIF/XMP/IPTC-style metadata fields and supported provenance containers

This layer **does not inspect image pixels** and does not run computer vision or an AI image classifier.

### 3. AI topics & keywords
Filters posts based on what they talk about. Built-in sensitivity levels range from core AI terms to broad adjacent technology topics.

Examples include:

- ChatGPT, OpenAI, Claude, Gemini
- Midjourney, Stable Diffusion, Sora, Runway, Kling, Flux
- LLMs, AI agents, RAG, MCP, machine learning
- AI infrastructure, vector databases, CUDA, AI chips
- At maximum sensitivity: cloud, AWS, Azure, GPU, API, automation, SaaS, and similar adjacent terms

You can also:

- add your own custom keywords
- exclude keywords you do not want filtered
- change keyword sensitivity at any time

## Filter modes

Choose how matching content is handled:

- **Blur** — blur detected posts while keeping them in the feed, with adjustable blur strength.
- **Remove** — remove detected posts from the feed completely.

Blurred posts can be temporarily revealed when needed.

## Install manually

Until the extension is available through the Chrome Web Store:

1. Download or clone this repository.
2. If downloaded as a ZIP, extract it.
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the repository folder — the folder containing `manifest.json`.
7. Open or refresh Facebook.
8. Click the **No AI Feed** extension icon to configure filtering.

> After installing or reloading an unpacked extension, refresh any Facebook tabs that were already open so the content script can activate.

## Settings

The popup lets you control:

- extension on/off
- Facebook AI-label detection
- media-metadata detection
- metadata sensitivity
- keyword/topic detection
- keyword sensitivity
- custom keywords
- keyword exclusions
- blur vs. remove behavior
- blur strength

The popup also shows whether the extension is connected to the current Facebook tab and how many feed posts it can currently detect/filter.

## Privacy

No AI Feed is designed to run locally in your browser.

- No Facebook post text is sent to the developer.
- No media is uploaded to the developer.
- No extension settings are sent to the developer.
- No analytics or advertising SDKs are included.
- No remote AI service is used.
- Preferences are stored locally with Chrome extension storage.

When metadata detection is enabled, the extension may request Facebook-hosted media so it can inspect embedded metadata locally in the browser. It does not forward that media to another service.

See [PRIVACY.md](./PRIVACY.md) for the full policy.

## Current scope

Version **1.0.0** focuses on Facebook and intentionally avoids pixel-level AI detection. The product is built around transparent evidence the user can control:

1. platform-provided AI labels
2. media metadata/provenance
3. customizable text/topic rules

Facebook changes its DOM frequently, so the feed detector includes multiple selectors and fallback rescanning to remain resilient to layout changes.

## Roadmap

The longer-term goal is to turn No AI Feed into a **cross-platform feed filter** using a shared filtering engine with platform-specific adapters.

### Planned platform expansion

- [x] Facebook
- [ ] Instagram
- [ ] X / Twitter
- [ ] LinkedIn
- [ ] Reddit
- [ ] YouTube
- [ ] Additional feed-based platforms

### Planned product improvements

- [ ] Shared global rules across platforms
- [ ] Per-platform keyword profiles
- [ ] Import/export filter presets
- [ ] Better metadata/provenance coverage
- [ ] Platform-specific AI-label adapters
- [ ] Optional allowlists/blocklists by page, account, or community
- [ ] Filter statistics and local-only activity summaries
- [ ] Chrome Web Store release

The architecture should evolve toward:

```text
No AI Feed
├── Shared filtering engine
│   ├── Label detection
│   ├── Metadata/provenance detection
│   ├── Keyword/topic rules
│   └── User preferences
│
└── Platform adapters
    ├── Facebook
    ├── Instagram
    ├── X / Twitter
    ├── LinkedIn
    ├── Reddit
    └── YouTube
```

## Contributing

Issues and pull requests are welcome, especially for:

- Facebook DOM compatibility fixes
- new platform adapters
- additional AI-label patterns
- metadata/provenance improvements
- keyword taxonomy improvements

If a platform changes its feed markup and filtering stops working, please open an issue with the platform, browser version, and a description of what stopped working.

## Disclaimer

No AI Feed is an independent project and is not affiliated with or endorsed by Meta, Facebook, OpenAI, Anthropic, Google, Microsoft, or any other platform or AI provider mentioned by its filters.
