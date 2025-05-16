// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN8r33EagKCeiZsoLCnLxHhFnCZ8ICUGE",
  authDomain: "ronakenterprise-1908e.firebaseapp.com",
  projectId: "ronakenterprise-1908e",
  storageBucket: "ronakenterprise-1908e.firebasestorage.app",
  messagingSenderId: "269517456876",
  appId: "1:269517456876:web:1faff3be901f446a9aecc9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
