# tailTALES

tailTALES is a private pet diary for memories, vet records, and rehoming posts.

## Run locally

```bash
cd client
npm install
npm run dev
```

The client stores demo pets and new entries in the browser. Breed choices and fallback dog photos come from the Dog CEO API.

## Firebase Google sign-in

Enable Google under Firebase Authentication > Sign-in method. The project configuration is in `client/src/firebase.js`; environment variables with the `VITE_FIREBASE_*` names can override those values for another Firebase project.

## GitHub Pages

The GitHub Actions workflow builds `client/index.html` and publishes `client/dist`. It also creates `404.html` so refreshing a nested pet diary route continues to work on Pages. Set the repository Pages source to **GitHub Actions** and push to `main`.

## Project structure

- `client/`: React and Vite application
- `client/public/assets/`: supplied tailTALES logo and markers
- `docs/`: proposal, wireframes, design system, and project notes
- `assets/`: original design assets
