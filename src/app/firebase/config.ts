import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyC4VKUDfOQN71YlWiZGepNZpccp9aPnvm4",
    authDomain: "crm-interithm-c1315.firebaseapp.com",
    projectId: "crm-interithm-c1315",
    storageBucket: "crm-interithm-c1315.firebasestorage.app",
    messagingSenderId: "399268060754",
    appId: "1:399268060754:web:b118b6391d13f0631f098b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)

export {app, auth}