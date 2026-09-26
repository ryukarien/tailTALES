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
- **What it gave back:** `: A firebase.js (or firebase.ts) configuration file initializing the Firebase app and Auth service, the implementation of a signInWithGoogle function using signInWithPopup with GoogleAuthProvider, an onAuthStateChanged state listener to monitor user session changes, and a brief walkthrough of the Firebase Console steps to enable the Google sign-in provider.
- **What I kept, what I changed, and why:** I kept the core Firebase initialization code and the modular Auth SDK logic completely intact. Specifically, I retained the standard initializeApp setup, the getAuth() service instantiation, and the initialization of the GoogleAuthProvider. I also kept the core structure of the signInWithPopup function and the onAuthStateChanged listener as they are the recommended, secure methods for triggering Google Sign-In and monitoring user authentication states in a web app.
  and why>`
- **Commit:** https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56

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
- **Commit:** https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56

### 2026-09-24 - Hero Edit/Delete, emoji placeholders, upload box, and page Share panel

- **Tool:** GitHub Copilot
- **What I asked for:** Asked it to make the pet-hero Edit/Delete controls
  mutate the pet record the same way the pet-card actions already did,
  stop auto-generating a Dog CEO photo when no image is uploaded, show an
  emoji placeholder instead, replace the native "Choose file" input with a
  light-yellow upload box, and expand the single "Share this page" action
  into separate Copy link / Facebook / Instagram actions.
- **What it gave back:** It searched `App.jsx` and `mockup.css` for the
  existing handlers first, wired the hero buttons to the same edit/delete
  logic as the pet cards, added a dog/cat/other emoji-placeholder branch
  to the Add Pet flow, restyled the upload control, and added a share
  panel with the three actions. It ran `npm run build` and a Playwright
  browser smoke test after each batch of edits, and caught one real
  runtime bug along the way (see Case 3 below).
- **What I kept, what I changed, and why:** Kept it reusing the existing
  edit/delete handlers for the hero buttons instead of writing separate
  logic, since duplicating that across the hero and the card would've
  been the kind of drift I'd have had to catch in review anyway. Had it
  fix the ordering bug in Case 3 before accepting the result.
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

### 2026-09-24 - Postgres backend for pet/diary/rehoming ownership

- **Tool:** Claude (Anthropic)
- **What I asked for:** Told it I was switching data storage from
  Firestore/localStorage to Postgres, and that my diary data needed to be
  private per-owner while rehoming posts stay public — this came out of a
  real bug where the diary wasn't actually scoped to whoever was signed
  in. Asked it to design the integration.
- **What it gave back:** A `schema.sql` with `pets`, `diary_entries`, and
  `vet_records` tables (diary/vet rows only ever reachable through a
  `pet_id` foreign key, never directly), an Express server
  (`index.js`, `db.js`, `authMiddleware.js`) that verifies each request's
  Firebase ID token with `firebase-admin` before touching the database,
  `routes/pets.js` and `routes/petRecords.js` where every query's `WHERE`
  clause checks `owner_uid = req.uid` (so ownership is enforced by
  Postgres itself, not by hiding buttons in the UI), a public
  `/api/pets/rehoming` route that never joins the diary/vet tables at
  all, and a client-side `api/api.js` that attaches the Firebase token to
  each request.
- **What I kept, what I changed, and why:** Haven't merged this into
  `App.jsx` yet — right now it's new, unused files sitting in `server/`
  and `client/src/api/`. Still need to: add `server/package.json` with
  the actual dependencies, rewrite `App.jsx` to call `api.js` instead of
  reading/writing the `localStorage` blob, and test the ownership checks
  against a real Postgres instance before I can say what I kept vs.
  changed from what it gave me.
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

### 2026-09-26 - Account-scoped pet diary and form updates

- **Tool:** GitHub Copilot
- **What I asked for:** Asked it to stop one signed-in user from seeing another
  user's pet diary, open My Pets automatically after sign-in, support custom
  species and breed values, add an optional photo to a new memory, and improve
  mobile spacing and Sign out placement.
- **What it gave back:** Changed the browser store to use a Firebase-UID-specific
  key, returned successful sign-ins to My Pets, added custom species and breed
  inputs, reused the photo upload card for diary memories, and tightened the
  mobile header layout.
- **What I kept, what I changed, and why:** Kept the UID-specific local keys as
  a short-term account separation improvement, but documented that they are
  not server security and do not sync between devices. I kept the optional
  image as a data URL to match the app's existing local photo handling.
- **Commit:** Pending; add the commit URL after committing these changes.

### 2026-09-26 - Public rehoming links and project documentation

- **Tool:** GitHub Copilot
- **What I asked for:** Asked it to fix the login-page Rehoming link and copied
  post links, keep private diary data out of public views, and update the weekly
  report, security/privacy assessment, AI-use record, and both README files.
- **What it gave back:** Made the login link navigate within the app, read the
  post ID from shared rehoming URLs, connected rehoming reads and publishing to
  the existing API when configured, and hid individual share actions for
  device-only preview posts. It also updated the project documentation to
  distinguish local account scoping from server-enforced privacy.
- **What I kept, what I changed, and why:** Kept the existing Express routes
  and added a client helper that creates a pet and marks it for rehoming. I
  kept local preview behavior as a fallback, but made its sharing limitation
  explicit because those posts cannot resolve in another browser.
- **Commit:** Pending; add the commit URL after committing these changes.

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
- **Commit:** https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56

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
- **Commit:** https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56

### Case 3 - Hero action effect referenced `id` before it was declared

- **What it gave me:** Copilot wired the pet-hero Edit/Delete buttons to a
  new effect that looked up the route `id` to know which pet to mutate, but
  placed that effect above the line in `App.jsx` that actually computed
  `id` from the route.
- **What was wrong with it:** `npm run build` passed clean — Vite's
  bundler doesn't catch this kind of temporal/ordering reference — so the
  bug only surfaced when it ran an actual Playwright browser session and
  clicked Edit, and the hero controls did nothing.
- **What I did instead:** Had it search the file for where `id` was
  computed, move the hero-action effect below that line, rebuild, and
  rerun the same Playwright check to confirm the click actually mutated
  the pet.
- **Commit:** https://github.com/YOUR-USERNAME/YOUR-REPO/commit/SHA

## 3. Who wrote what

At least a fifth of this project is code you wrote yourself. Name it, and explain
it in your own words.

> Group projects: give each member their own heading below, and use your GitHub
> handle as the heading. You are graded on your own section.

### Written by me

- **File:** `client/src/styles.css`
- **Commit:** https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56
- **What it does and why it is built this way:** Copilot's first pass at
  `styles.css` worked but wasn't organized in a way I could navigate —
  rules for different components and screens were interleaved rather than
  grouped. I reconstructed the file myself: split it into clear sections
  (colors/variables, typography, navigation, buttons and forms, pet
  cards, diary and vet record layouts, rehoming cards, login page, and
  the 700px mobile breakpoint), and grouped each screen's rules together
  instead of scattered through the file. I didn't originate the CSS
  values themselves — those came from `docs/03-design-system.md` and
  Copilot's implementation of it — but the structure and section
  boundaries are mine, so the file is actually maintainable.


### The AI-written part I understand best

- **File:** `client/src/firebase.js` (Google Sign-In setup)
- **Commit:** `https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56
- **What it does and why we kept it:** Initializes the Firebase app from the
  `VITE_FIREBASE_*` env variables and exposes `signInWithGoogle`,
  `signOutUser`, and `watchAuthState`, using the `GoogleAuthProvider` and
  `signInWithPopup` functions. Kept close to what Gemini produced because it
  matches the standard single-provider sign-in pattern — `<add your own
  sentence on why you understand and trust this file>`

- **File:** `client/src/styles.css`
- **Commit:** `https://github.com/ryukarien/tailTALES/commit/400000a90dfbd1481123f549bea2ecd9a5443c56`
- **What it does and why we kept it:** Implements the tailTALES design
  system as CSS custom properties and component styles — the colour
  palette, type scale, and spacing values are the ones I worked out myself
  in `docs/03-design-system.md` from my Figma wireframes; Copilot wrote the
  CSS file that turns those decisions into code, including the responsive
  700px breakpoint. I understand it well enough to have caught and had it
  fix the bug where a stray `+` character in front of `@media` was silently
  breaking the mobile styles.



