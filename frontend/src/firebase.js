import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2kIPX7TaJvpYkfBUK1q6TywoeWuH6zKE",
  authDomain: "elevate-1d91c.firebaseapp.com",
  projectId: "elevate-1d91c",
  storageBucket: "elevate-1d91c.firebasestorage.app",
  messagingSenderId: "639871825050",
  appId: "1:639871825050:web:bba9524624c2fb35485b23",
  measurementId: "G-HNEJV5Z4ZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
export default app;
