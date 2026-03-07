
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLclY5iOE3TJgwG18PRisVYdvVr866_m0",
  authDomain: "test-builder-e5880.firebaseapp.com",
  projectId: "test-builder-e5880",
  storageBucket: "test-builder-e5880.firebasestorage.app",
  messagingSenderId: "873551277392",
  appId: "1:873551277392:web:143b5cde231fc8c836d055",
  measurementId: "G-W4F866D6Z7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
