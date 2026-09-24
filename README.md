# tailTALES

A private digital pet diary — profiles, memories, and vet records — with a public board for rehoming a pet when the time comes.

**Live site:** https://ryukarien.github.io/tailTALES/
**API:** not deployed yet — see [Demo mode](#demo-mode)
**Demo video:** Add the final video link here



## What it does

- Sign in securely with Google through Firebase Authentication
- Create pet profiles with a name, breed, birthday, and photo (or an emoji placeholder when no photo is uploaded)
- Browse a private My Pets dashboard — visible only to the signed-in owner
- Keep a diary of memories with photos, captions, and dates
- Record vaccines and other vet notes
- Edit and delete pets, diary entries, and vet records
- Browse public rehoming posts without an account
- Publish, edit, and remove rehoming posts when signed in — only the original owner can remove their own post
- Share a rehoming post via copy link, Facebook, or Instagram
- Choose a breed from the Dog CEO API (dogs) or a second breed API (cats), or type one in under "Other"

## Built with

React and Vite on the front end. Firebase Authentication (Google sign-in) for
identity. The backend is Express and PostgreSQL — written, but not yet wired up
to the client or deployed (see [Demo mode](#demo-mode)). The client deploys to
GitHub Pages; the API and database are meant for a host that can run Node (see
the table below).

## Demo mode

This repository is meant to run two ways, chosen by one environment variable at
**build** time — but right now only one of those two ways actually works end to
end.

| `VITE_USE_MOCK_API` | What happens | Status |
| --- | --- | --- |
| unset, or `true` | The client reads and writes its own `localStorage`. No server, no database, nothing shared between visitors or devices. | **This is what's live today.** |
| `false` | The client calls the Express API in `server/`, which reads and writes real PostgreSQL, scoped per-owner by Firebase UID. | **Server code exists (`server/`, `client/src/api/api.js`) but `App.jsx` still reads/writes `localStorage` directly — the switch hasn't been made, and the toggle itself isn't implemented yet.** |

**Demo mode is a starting point and a fallback, not the finished project.** The
plan is all three pieces — client, API, database — deployed and talking to each
other, with data scoped so a pet's diary is visible only to its owner and only
rehoming posts are public. Demo mode is there so the interface has something to
show while that's still in progress.

GitHub Pages serves static files and cannot run Node, so the API and database
can never live there. Once the switch happens, they go somewhere else:

| Piece | Options |
| --- | --- |
| **API** | Render, Railway, Fly.io, Koyeb, or a VPS |
| **Database** | Neon, Supabase, Railway, or your own PostgreSQL |

## Screens

The app follows the proposal and wireframes in the `docs/` folder:

- **My Pets** (`/`): pet cards and the Add a pet form — private to the signed-in owner
- **Pet Diary** (`/pets/:id`): diary memories and vet records for one pet
- **Rehoming** (`/rehoming`): public rehoming posts, with publish/edit/remove controls for signed-in owners

The layout adapts at a 700px breakpoint. Desktop uses a top navigation bar; mobile moves navigation to the bottom of the screen.

## Running it yourself

**The client only, in demo mode.** No database needed — this is the current default.

```bash
cd client
npm install
npm run dev          # http://localhost:5173
```

Create a production build with `npm run build` from `client/`. The build produces both `dist/index.html` and `dist/404.html`; the second file lets GitHub Pages serve the React app when a visitor refreshes a nested route like `/pets/pet-1`.

**The whole stack, once the client is switched over to the API.** Needs a PostgreSQL, local or hosted:

```bash
# 1. the database
docker run --name tailtales-pg -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=tailtales -p 5432:5432 -d postgres:17
psql postgresql://postgres:devpassword@localhost:5432/tailtales -f server/schema.sql

# 2. the API
cd server
npm install                 # needs a package.json — not yet added, see Known Limitations
cp .env.example .env        # DATABASE_URL, FIREBASE_SERVICE_ACCOUNT
npm run dev                 # http://localhost:4000

# 3. the client, in another terminal
cd client
npm install
# set VITE_API_BASE=http://localhost:4000 and switch App.jsx to use client/src/api/api.js
npm run dev
```

## Environment variables

None of these are committed.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. Contains a password |
| `FIREBASE_SERVICE_ACCOUNT` | server | Firebase Admin credentials (JSON), used to verify each request's ID token |
| `CLIENT_ORIGIN` | server | the client's origin, for CORS |
| `PORT` | server | set by the host, do not set it yourself |
| `VITE_FIREBASE_*` | client, at build time | Firebase web config — public by design, see Firebase Setup below |
| `VITE_API_BASE` | client, at build time | the API's public URL, no trailing slash (not yet consumed by `App.jsx`) |

Every `VITE_` value is compiled into the built JavaScript and is **public**. Never put a database password or service-account key in one.

## Firebase setup

Google sign-in is configured in `client/src/firebase.js`. To use a different Firebase project, create `client/.env.local` with `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.

In the Firebase console: open **Authentication**, enable the **Google** provider, and add your local development URL and GitHub Pages URL under authorized domains.

## Deploying

**Client, to GitHub Pages.** Already wired up in `.github/workflows/deploy-pages.yml`.

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.**
2. Nothing else, until the API is live — demo mode is the default, so the deploy works on its own today. Once the client is switched to call the API, add `VITE_API_BASE` under **Settings > Secrets and variables > Actions > Variables** and re-run the workflow.

The repository must be **public** for Pages to serve it on a free account.

**API and database.** Not deployed yet. Point a host at the `server/` folder, set `DATABASE_URL` and `FIREBASE_SERVICE_ACCOUNT` in its dashboard, and run `server/schema.sql` once against the hosted database.

## Project structure

```text
client/
  index.html                 Main browser entry point
  public/assets/              Logo and navigation artwork
  src/App.jsx                 Routes, screens, auth state — currently reads/writes localStorage
  src/firebase.js              Firebase Google Authentication setup
  src/api/dogApi.js            Dog CEO breed integration
  src/api/api.js                New Postgres API client — not yet used by App.jsx
  src/styles.css                Visual system and responsive layout
server/
  schema.sql                    pets, diary_entries, vet_records tables
  db.js                          Postgres connection pool
  authMiddleware.js              Verifies Firebase ID tokens
  index.js                       Express app entry point
  routes/pets.js                  Pet CRUD + public rehoming feed
  routes/petRecords.js            Diary and vet record routes, scoped to pet ownership
assets/
  wireframes/                     Desktop and mobile design references
docs/
  01-proposal.md                  Product proposal and data plan
  02-mockup.md                     Wireframe decisions and screen requirements
  03-design-system.md              Visual design notes
.github/workflows/
  deploy-pages.yml                 GitHub Pages build and deployment
```

## Architecture

Today: the Vite client is the whole deployed app. Firebase Authentication proves who's signed in, but all pet/diary/vet/rehoming data lives in browser `localStorage`, so nothing is actually shared between users or devices yet.

Planned: the client calls an Express API (`server/`), which verifies each request's Firebase ID token and reads/writes PostgreSQL. Ownership is enforced in the database query itself — every pet row carries the owner's Firebase UID, and diary/vet routes check that UID before touching a pet's records — not just by hiding buttons in the UI. Only pets marked `is_rehoming` are ever returned by the public rehoming endpoint, and that endpoint never joins the diary or vet tables.

## Known limitations

- The live demo is browser-local: data isn't shared between devices or users, and two people signed in on the same browser would see each other's "private" pets — this is the main reason the Postgres backend exists.
- The Postgres API in `server/` isn't deployed, doesn't have a `package.json` yet, and `App.jsx` hasn't been switched to call it — so the ownership and privacy fixes it implements aren't live yet.
- Photos are stored as browser image data, not uploaded to permanent storage.
- Instagram sharing has no true prefilled web-share API; it falls back to a mobile share-intent or copy image + caption on desktop.

## Design references

- [Project proposal](docs/01-proposal.md)
- [Wireframe and mockup decisions](docs/02-mockup.md)
- [Design system](docs/03-design-system.md)
- [Wireframe assets](assets/wireframes/)

## AI use

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

This project was developed with assistance from GitHub Copilot, Gemini, and
Claude — used for Firebase setup, the React screens, breed API integration,
responsive styling, debugging, and the PostgreSQL/Express backend. All generated
work was reviewed against the proposal, wireframes, and a production build. The
full account, including where the AI got it wrong, is in [AI-USAGE.md](AI-USAGE.md).

## Author

Ryukarien

## License

MIT. See [LICENSE](LICENSE).