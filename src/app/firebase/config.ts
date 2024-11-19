// Import Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4VKUDfOQN71YlWiZGepNZpccp9aPnvm4",
    authDomain: "crm-interithm-c1315.firebaseapp.com",
    projectId: "crm-interithm-c1315",
    storageBucket: "crm-interithm-c1315.firebasestorage.app",
    messagingSenderId: "399268060754",
    appId: "1:399268060754:web:b118b6391d13f0631f098b"
};

// Initialize Firebase app (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
