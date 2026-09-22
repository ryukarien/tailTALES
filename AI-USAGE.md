# AI usage

This project was built with AI assistance. This file is the record of it. It is
graded as the finals badge, and it is worth 100 points.

Start it in week 1 and keep it up as you go. The commit history of this file is
part of the evidence: a file written all at once the night before the deadline
looks exactly like what it is.

## 1. How I used AI

At least six entries. One per real use. Every entry needs a commit link.

### 2026-09-22 - Firebase Google Authentication integration

- **Tool:** Gemini (Google AI)
- **What I asked for:** Pasted Part A ("Firebase Authentication — Google
  sign-in only") from my setup guide — the steps for creating the Firebase
  project, enabling the Google sign-in provider, registering a web app, and
  wiring `signInWithGoogle`/`onAuthStateChanged` into the client — and asked
  Gemini to implement it in my project folder.
- **What it gave back:** `<fill in — e.g. the firebase.js config file, the
  signInWithGoogle/onAuthStateChanged setup, or a walkthrough of the Firebase
  console steps>`
- **What I kept, what I changed, and why:** `<fill in — what you kept as-is,
  what you had to adjust to fit your file structure or the course template,
  and why>`
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

### 2026-09-22 - Building the My Pets, Pet Diary, and Rehoming screens

- **Tool:** GitHub Copilot
- **What I asked for:** Asked it to implement the three screens from my
  proposal and wireframes (My Pets, Pet Diary, Rehoming) into the client,
  including the breed dropdown and some seeded demo data so the screens
  weren't empty.
- **What it gave back:** It reviewed `01-proposal.md`, `02-mockup.md`, and
  the existing client files first, then rewrote `App.jsx` with the three
  routes, added `dogApi.js` for the Dog CEO breed dropdown with a fallback
  image, seeded demo pets/diary entries/vet records/rehoming posts into
  `localStorage`, and wrote `styles.css` to match the wireframes' desktop
  and mobile layout. It ran `npm run build` itself along the way and hit two
  real errors before the build passed clean (see Case 1 and Case 2 below).
- **What I kept, what I changed, and why:** Kept the route structure and the
  Dog CEO fallback-image approach as given, since both matched my proposal.
  Had it fix the duplicate `App.jsx` export and the over-broad sign-in gate
  on `/rehoming` (below) before I accepted the result, since neither matched
  what I'd actually specified.
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

## 2. Where the AI got it wrong

Three cases. Be specific. If you write that the AI was never wrong, this section
scores zero.

### Case 1 - Old template code left in App.jsx caused a duplicate export

- **What it gave me:** Copilot rewrote `App.jsx` with the new tailTALES
  routes and logic, but left the original template's `App` function (about
  157 lines) sitting underneath the new one instead of replacing it.
- **What was wrong with it:** Two `export default` statements in the same
  file. `npm run build` failed on it immediately — Vite can't have a module
  with more than one default export.
- **What I did instead:** Opened `App.jsx`, confirmed the old template code
  was just dead weight below the working version, deleted it, and reran the
  build to confirm the file compiled with a single clean export.
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

### Case 2 - Rehoming was gated behind sign-in when it should be public

- **What it gave me:** Copilot's first pass wired Google sign-in as a
  blanket gate across the app, so an anonymous visitor hitting `/rehoming`
  got redirected to the Log-In page.
- **What was wrong with it:** My own proposal (`docs/01-proposal.md`) says
  the Rehoming screen has to be readable by anyone without an account —
  only publishing or removing a post should require sign-in. The AI's
  default of "gate everything behind auth" didn't match that.
- **What I did instead:** Had it open the `/rehoming` route publicly and
  keep the sign-in check only on the publish/remove actions, then rebuilt
  and checked the route loaded without being signed in.
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

### Case 3 - short title

- **What it gave me:**
- **What was wrong with it:**
- **What I did instead:**
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

## 3. Who wrote what

At least a fifth of this project is code you wrote yourself. Name it, and explain
it in your own words.

> Group projects: give each member their own heading below, and use your GitHub
> handle as the heading. You are graded on your own section.

### Written by me

### Written by me

- **File:** `client/src/styles.css`
- **Commit:** `<paste >`
- **What it does and why it is built this way:** I wrote the main styling for tailTALES, including the color palette, typography, navigation, buttons, forms, pet cards, diary and vet record layouts, rehoming cards, login page, and responsive mobile layout. I used CSS variables for the main colors so the design stays consistent across the application, and I used a media query at 700px to adapt the desktop layout for mobile devices. I also added reusable styling for buttons, forms, cards, tabs, and empty states so the different screens have a consistent visual design.


### The AI-written part I understand best

- **File:** `client/src/styles.css`
- **Commit:** `<fill in the commit link>`
- **What it does and why we kept it:** Implements the tailTALES design
  system as CSS custom properties and component styles — the colour
  palette, type scale, and spacing values are the ones I worked out myself
  in `docs/03-design-system.md` from my Figma wireframes; Copilot wrote the
  CSS file that turns those decisions into code, including the responsive
  700px breakpoint. I understand it well enough to have caught and had it
  fix the bug where a stray `+` character in front of `@media` was silently
  breaking the mobile styles.

- **File:** `client/src/firebase.js` (Google Sign-In setup)
- **Commit:** `<fill in the commit link>`
- **What it does and why we kept it:** Initializes the Firebase app from the
  `VITE_FIREBASE_*` env variables and exposes `signInWithGoogle`,
  `signOutUser`, and `watchAuthState`, using the `GoogleAuthProvider` and
  `signInWithPopup` functions. Kept close to what Gemini produced because it
  matches the standard single-provider sign-in pattern — `<add your own
  sentence on why you understand and trust this file>`

## Still to fill in

- Four more entries in Section 1 (six total) — log each one the day it
  happens, with its commit link, not at the end.
- Case 3 in Section 2 — one more real mistake and what you did about it.
- A file for "Written by me" in Section 3 — see the note in that section;
  `styles.css` as it stands was Copilot's work, not yours.
- Every commit link still marked `<fill in the commit link>` or `SHA`.