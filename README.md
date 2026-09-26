# tailTALES

A private digital pet diary — profiles, memories, and vet records — with a public board for rehoming a pet when the time comes.

**Live site:** https://ryukarien.github.io/tailTALES/
**API:** not deployed yet — see [Deploying the API](#deploying-the-api)
**Demo video:** Add the final video link here



## What it does

- Sign in securely with Google through Firebase Authentication
- Create pet profiles with a name, breed, birthday, and photo (or an emoji placeholder when no photo is uploaded)
- Browse My Pets and records from the signed-in account's browser-local store
- Keep a diary of memories with photos, captions, and dates
- Record vaccines and other vet notes
- Edit and delete pets, diary entries, and vet records
- Browse public rehoming posts without an account
- Publish rehoming posts when signed in; posts on the configured API are public
- Share rehoming posts via Copy link, Facebook, or Instagram. Local preview links
  include a snapshot of the listing but do not publish it to the shared feed.
- Choose a breed from the Dog CEO API (dogs) or a second breed API (cats), or type one in under "Other"

## Built with

React and Vite on the front end. Firebase Authentication (Google sign-in) for
identity. The Express/PostgreSQL backend contains owner-scoped pet and record
routes. The client uses it for public rehoming reads and publishing when
`VITE_API_BASE` is configured, but private pet, diary, and vet operations still
use browser storage. The client deploys to GitHub Pages; the API and database
need a host that can run Node (see the table below).

## Demo mode

The client can run as a local demo without a server. Configure `VITE_API_BASE`
to use the API for public rehoming posts; private pet and record operations
remain local until they are connected to the backend.

| Configuration | What happens | Status |
| --- | --- | --- |
| `VITE_API_BASE` unset | Pet, diary, and vet data use browser `localStorage`, separated by Firebase UID. Rehoming uses local preview data if the API is unavailable. | **UI preview only; private data is browser-local and not server-secured. Shared card links contain a listing snapshot but do not add it to the public feed.** |
| `VITE_API_BASE` points to the API | The client fetches and publishes public rehoming posts through Express. Pet, diary, and vet data still use browser storage. | **Partial integration; the API must be deployed and configured.** |

**Demo mode is a starting point and a fallback, not the finished project.** The
remaining goal is to connect private pet and record operations to the API so
they are server-authorized and available across devices, while keeping only
deliberately published rehoming posts public.

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
- **Rehoming** (`/rehoming`): public posts, with publishing for signed-in owners

The layout adapts for mobile screens. Desktop uses a top navigation bar; mobile
moves the main navigation to the bottom while keeping account actions in the
header.

## Running it yourself

**The client only, in demo mode.** No database needed — this is the current default.

```bash
cd client
npm install
npm run dev          # http://localhost:5173
```

Create a production build with `npm run build` from `client/`. The build produces both `dist/index.html` and `dist/404.html`; the second file lets GitHub Pages serve the React app when a visitor refreshes a nested route like `/pets/pet-1`.

**Run the API-backed rehoming flow locally.** The private pet and record flows
remain browser-local. This setup needs PostgreSQL, local or hosted:

```bash
# 1. the database
docker run --name tailtales-pg -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=tailtales -p 5432:5432 -d postgres:17
psql postgresql://postgres:devpassword@localhost:5432/tailtales -f server/schema.sql

# 2. the API
cd server
npm install
cp .env.example .env        # set DATABASE_URL and Firebase service account
npm run dev                 # http://localhost:4000

# 3. the client, in another terminal
cd client
npm install
# client/.env.local: VITE_API_BASE=http://localhost:4000
npm run dev
```

## Environment variables

Secret values are not committed. `server/.env.example` contains variable names
and placeholders only; copy it to `server/.env` for local development.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. Contains a password |
| `FIREBASE_SERVICE_ACCOUNT` | server | Firebase Admin credentials (JSON), used to verify each request's ID token |
| `CLIENT_ORIGIN` | server | the client's origin, for CORS |
| `PORT` | server | set by the host, do not set it yourself |
| `VITE_FIREBASE_*` | client, at build time | Firebase web config — public by design, see Firebase Setup below |
| `VITE_API_BASE` | client, at build time | API's public URL, no trailing slash; used for public rehoming reads and publishing |

Every `VITE_` value is compiled into the built JavaScript and is **public**. Never put a database password or service-account key in one.

## Firebase setup

Google sign-in is configured in `client/src/firebase.js`. To use a different Firebase project, create `client/.env.local` with `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.

In the Firebase console: open **Authentication**, enable the **Google** provider, and add your local development URL and GitHub Pages URL under authorized domains.

## Deploying

**Client, to GitHub Pages.** Already wired up in `.github/workflows/deploy-pages.yml`.

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.**
2. Add `VITE_API_BASE` under **Settings > Secrets and variables > Actions > Variables** when the API is deployed, then re-run the workflow to enable server-backed rehoming posts.

The repository must be **public** for Pages to serve it on a free account.

### Deploying the API

The API can run on Render with PostgreSQL hosted on Neon. These steps deploy
the current API, which serves the public rehoming flow; private pet and diary
operations still use browser storage.

1. Create a PostgreSQL database on Neon. In its SQL Editor, run the contents
  of `server/schema.sql`.
2. Create a Render **Web Service** connected to this GitHub repository. Set
  **Root Directory** to `server`, **Build Command** to `npm ci`, and
  **Start Command** to `npm start`. The service health-check path can be
  `/health`.
3. Add these environment variables in Render. Get `DATABASE_URL` from Neon;
  generate `FIREBASE_SERVICE_ACCOUNT` in Firebase Console > Project settings >
  Service accounts. Paste the service-account JSON into Render as a secret;
  never commit it or add it to a `VITE_` variable.

  | Variable | Value |
  | --- | --- |
  | `DATABASE_URL` | Neon connection string |
  | `FIREBASE_SERVICE_ACCOUNT` | Firebase service-account JSON |
  | `CLIENT_ORIGIN` | `https://ryukarien.github.io` |

4. Deploy the Render service and confirm its `/health` URL returns `{"status":"ok"}`.
5. In GitHub repository **Settings > Secrets and variables > Actions >
  Variables**, add `VITE_API_BASE` with the Render service origin, without a
  trailing slash (for example, `https://tailtales-api.onrender.com`). Re-run
  the **Deploy client to GitHub Pages** workflow.
6. Replace the API status at the top of this README with the deployed API URL.

The API refuses to start in production if `CLIENT_ORIGIN` is missing. `PORT`
is supplied by Render; do not add it manually. For local development, copy
`server/.env.example` to `server/.env` and set the database and Firebase
credentials. Keep `.env` private.

## Project structure

```text
client/
  index.html                 Main browser entry point
  public/assets/              Logo and navigation artwork
  src/App.jsx                 Routes, screens, auth state, UID-scoped local pet/record data
  src/firebase.js              Firebase Google Authentication setup
  src/api/dogApi.js            Dog CEO breed integration
  src/api/api.js                API client; currently used for public rehoming reads/publishing
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

Today: the Vite client uses Firebase Authentication and stores pet, diary, and vet data in browser `localStorage` under a Firebase-UID-specific key. This keeps accounts separate in the app on one browser, but data is not server-enforced or synced to another device. Rehoming reads and publishing use the Express API when configured; otherwise the board falls back to local preview data.

Remaining: connect the private pet, diary, and vet flows to the Express API
(`server/`). It verifies Firebase ID tokens and enforces owner UID in database
queries. Only pets marked `is_rehoming` are returned by the public rehoming
endpoint, which never joins the diary or vet tables.

## Known limitations

- Pet, diary, and vet data remains browser-local and does not sync between devices. UID-specific keys prevent another account from seeing the records in the app UI on the same browser, but this is not a substitute for server-side authorization.
- The Postgres API in `server/` is not deployed yet. The client uses its public rehoming routes when configured, but has not switched private pet and record operations to the API.
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