# tailTALES setup

The working application is in `client/` and is ready for GitHub Pages.

```bash
cd client
npm install
npm run dev
```

For Google sign-in, enable the Google provider in Firebase Authentication. The client uses the Firebase configuration in `src/firebase.js` and can be built with `VITE_FIREBASE_*` environment variables.

The app uses Dog CEO for breed choices and local browser storage for demo pet data. Photos are selected from the user's local device and stored as image data for the current browser profile.
