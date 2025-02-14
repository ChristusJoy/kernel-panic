// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (get from Firebase Console)
const firebaseConfig = {

    apiKey: "AIzaSyDr_7PNva_j2pG1rmfytBVz8hTCm4cKXOo",
  
    authDomain: "waste-segregation-326ee.firebaseapp.com",
  
    projectId: "waste-segregation-326ee",
  
    storageBucket: "waste-segregation-326ee.firebasestorage.app",
  
    messagingSenderId: "517117144781",
  
    appId: "1:517117144781:web:8e1a5312e0a34810d9c384"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
