import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export default function Login() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Successfully logged in:", user.displayName);
      // Redirect your user or update app state here
    } catch (error) {
      console.error("Authentication failed:", error.message);
    }
  };

  return (
    <div className="login-screen">
      <h2>Welcome to tailTALES</h2>
      <button onClick={handleGoogleSignIn}>
        Continue with Google
      </button>
    </div>
  );
}
