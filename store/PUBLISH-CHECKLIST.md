# Chrome Web Store release record — No AI Feed 1.3.2

**Status:** Live  
**Confirmed:** September 27, 2026  
**Store item ID:** `fkohiolphgncfcihlegdmdnjgmfmigmi`  
**Store URL:** https://chromewebstore.google.com/detail/no-ai-feed/fkohiolphgncfcihlegdmdnjgmfmigmi

This file previously tracked pre-publication work for 1.3.2. The release is now public; the sections below are retained as the operational record for future updates.

## Release package

- Public version: **1.3.2**
- Upload package: `dist/no-ai-feed-1.3.2-chrome.zip`
- Package checksum: `dist/SHA256SUMS.txt`
- Listing copy: `store/LISTING-EN.txt` and `store/LISTING-AR.txt`
- Privacy declarations: `store/PRIVACY-FIELDS.md`
- Reviewer instructions: `store/REVIEWER-INSTRUCTIONS.txt`
- Listing graphics: `store/assets/`
- Validation record: `store/QA.md`

## Release gates used for 1.3.2

| Gate | Passing condition |
| --- | --- |
| Package | MV3, valid version/icons/localization, manifest at ZIP root, runtime files only |
| Behavior | Rules, exceptions, reveal/hide, on/off, persistence and rescan work |
| Permissions/privacy | Narrow permissions; disclosures match local processing and metadata requests |
| Listing/assets | Accurate claims; current UI screenshots; correct dimensions |
| Publisher | Verified publisher account and factual distribution/privacy declarations |

## Future update sequence

1. Increment the extension version before uploading a new Web Store build.
2. Run `npm test`.
3. Run `npm run package` and verify `dist/SHA256SUMS.txt`.
4. Test the packaged extension on current Facebook and YouTube.
5. Update listing/privacy copy only when product behavior or disclosures change.
6. Upload the new package in the existing Chrome Web Store item.
7. Complete review/publishing in the Web Store dashboard.
8. After publication, update README, changelog and GitHub Release so all public surfaces show the same version and status.

## Official references

Checked September 24, 2026:

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
