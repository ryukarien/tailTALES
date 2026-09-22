// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChMt1xWHGpNO8wm3a0CwybJBqYdOQAltg",
  authDomain: "tailtales-66e93.firebaseapp.com",
  projectId: "tailtales-66e93",
  storageBucket: "tailtales-66e93.firebasestorage.app",
  messagingSenderId: "412955844871",
  appId: "1:412955844871:web:296b6077b78d7c8d0865a2",
  measurementId: "G-J807D10MTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();