# tailTALES

A private digital pet diary for recording the moments, care, and next chapters that make a pet's story special.

**Repository:** https://github.com/ryukarien/tailTALES

**Live site:** https://ryukarien.github.io/tailTALES/

**Demo video:** Add the final video link here

## What It Does

- Sign in securely with Google through Firebase Authentication
- Create pet profiles with a name, breed, birthday, and local photo upload
- Browse a private My Pets dashboard
- Keep a diary of memories with photos, captions, and dates
- Record vaccines and other vet notes
- Browse public rehoming posts without an account
- Publish and remove rehoming posts when signed in
- Choose dog breeds from the Dog CEO API
- Keep demo data and local uploads available after a browser refresh

## Screens

The app follows the proposal and wireframes in the `docs/` folder:

- **My Pets** (`/`): pet cards and the Add a pet form
- **Pet Diary** (`/pets/:id`): diary memories and vet records
- **Rehoming** (`/rehoming`): public rehoming posts with signed-in publishing controls

The layout adapts at a 700px breakpoint. Desktop uses a top navigation bar; mobile moves navigation to the bottom of the screen.

## Built With

- React 18
- Vite
- Firebase Authentication with Google sign-in
- Dog CEO API for dog breeds and fallback dog images
- Browser `localStorage` for the current demo data store
- CSS with custom properties and responsive media queries
- GitHub Pages for deployment

## Running Locally

```bash
cd client
npm install
npm run dev
```

Then open `http://localhost:5173`.

Create a production build with:

```bash
cd client
npm run build
```

The build creates both `dist/index.html` and `dist/404.html`. The second file allows GitHub Pages to serve the React application when a visitor refreshes a nested route such as `/pets/pet-1`.

## Firebase Setup

Google sign-in is configured in `client/src/firebase.js`. To use a different Firebase project, create `client/.env.local` with:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

In the Firebase console:

1. Open **Authentication**.
2. Enable the **Google** provider.
3. Add your local development URL and GitHub Pages URL under authorized domains.

Firebase web configuration values are public client configuration. Do not put database passwords or private server credentials in `VITE_` variables.

## Demo Data and Photos

The current build is intentionally usable without a separate server. Seed pets, memories, vet records, and rehoming posts are stored in `localStorage` under `tailtales-data`.

Users select photos from their device with a local file picker. The selected image is stored as browser image data for that browser profile. No image is uploaded to a third-party storage service in this demo build.

New dog breeds and fallback dog images are requested from [Dog CEO](https://dog.ceo/dog-api/). If the breed request is unavailable, the app uses a small fallback list.

## GitHub Pages Deployment

The workflow at `.github/workflows/deploy-pages.yml` builds the client whenever changes are pushed to `main` and publishes `client/dist`.

Before the first deployment:

1. Make the repository public if it is private.
2. Open **Settings > Pages**.
3. Set the source to **GitHub Actions**.
4. Push to `main` and check the **Actions** tab.

The workflow automatically supplies the `/tailTALES/` base path needed by a project GitHub Pages site.

## Project Structure

```text
client/
  index.html                 Main browser entry point
  public/assets/             Supplied logo and navigation artwork
  src/App.jsx                Routes, screens, auth state, and demo data
  src/firebase.js            Firebase Google Authentication setup
  src/api/dogApi.js          Dog CEO API integration
  src/styles.css             Visual system and responsive layout
assets/
  wireframes/                Desktop and mobile design references
docs/
  01-proposal.md             Product proposal and data plan
  02-mockup.md               Wireframe decisions and screen requirements
  03-design-system.md        Visual design notes
.github/workflows/
  deploy-pages.yml           GitHub Pages build and deployment
```

## Architecture

The Vite client is the deployed application. Firebase Authentication proves the identity of a signed-in owner, while the current demo version keeps pet data in browser `localStorage` so the interface can run on GitHub Pages without a separate database server. Dog CEO is used only for breed choices and fallback dog images. The proposal documents the next production step: moving private records and public rehoming posts to a PostgreSQL API with Firebase ID-token verification.

## Known Limitations

- The current demo store is browser-local, so data is not shared between devices or users.
- Local photos are not uploaded to a permanent storage service.
- The rehoming feed is public in the interface, but persistent multi-user publishing requires the planned PostgreSQL API.
- Pet Edit/Delete and diary card Edit/Delete controls are represented in the wireframe direction but still need their full CRUD handlers.

## Design References

- [Project proposal](docs/01-proposal.md)
- [Wireframe and mockup decisions](docs/02-mockup.md)
- [Design system](docs/03-design-system.md)
- [Wireframe assets](assets/wireframes/)

## AI Use

This project was developed with assistance from GitHub Copilot and Gemini. AI helped with Firebase setup, React implementation, Dog CEO integration, responsive styling, and debugging. All generated work was reviewed against the proposal, wireframes, and production build output. The detailed record is in [AI-USAGE.md](AI-USAGE.md).

## Author

Ryukarien

## License

MIT. See [LICENSE](LICENSE).
