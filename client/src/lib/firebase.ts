import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADezksc90nRGfF6EnshNYsDsmuJzT1oA0",
  authDomain: "inkplan-393e8.firebaseapp.com",
  projectId: "inkplan-393e8",
  appId: "1:354322088561:web:57066b3ceeb9b0976151d0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 🔥 important: keep user logged in
setPersistence(auth, browserLocalPersistence);

export const googleProvider = new GoogleAuthProvider();

// 🔥 force account picker + fix config issues
googleProvider.setCustomParameters({
  prompt: "select_account",
});