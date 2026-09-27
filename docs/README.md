# Project documents

Everything your project is marked on that is not code. Keep it here, in the
repository, so it is versioned alongside the thing it describes.

| File | What it is | When |
| --- | --- | --- |
| [01-proposal.md](01-proposal.md) | the revised proposal | finals, m8a1 |
| [02-mockup.md](02-mockup.md) | what the app will look like | finals, m8a2 |
| [03-design-system.md](03-design-system.md) | colours, type, components | finals, m8a3 |
| [04-weekly-reports.md](04-weekly-reports.md) | a few lines a week | every week |
| [05-demo-video.md](05-demo-video.md) | the recording, and its plan | the end |
| [06-security-and-privacy.md](06-security-and-privacy.md) | what you checked before making this public | before your first push |
| [../SECURITY-CHECKLIST.md](../SECURITY-CHECKLIST.md) | graded security evidence checklist | update before release |

Put images in `assets/`. A screenshot named `assets/screenshot.png` is referenced
by the main README, and a README with an image reads as finished in a way one
without an image does not.

## Current implementation note (2026-09-27)

The current client loads private pet, diary, and vet records through the
authenticated API. The production rollout still requires the database migration,
an updated GitHub Pages build with `VITE_API_BASE`, and authenticated tests in
two browsers. Older records in browser storage are not automatically imported.
The mobile header fix is in local source and still needs a Pages deployment. See the
[security and privacy notes](06-security-and-privacy.md) and
[graded security checklist](../SECURITY-CHECKLIST.md) for current evidence.

**Write these as you go.** A weekly report written on the last day is obvious to
read and worth very little.
