// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyACBnPKi60Nqys5PHE7T2GKgtfUp7yBZqg",
    authDomain: "sports-feed-83069.firebaseapp.com",
    projectId: "sports-feed-83069",
    storageBucket: "sports-feed-83069.appspot.com",
    messagingSenderId: "381816846472",
    appId: "1:381816846472:web:594f7d66702dae4b71873d",
    measurementId: "G-ECE4YC2TP0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
