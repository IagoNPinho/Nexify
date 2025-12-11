// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVVIRMyzcFaz91lQ7wViqAfSj24mZQHsA",
  authDomain: "nexify-9c438.firebaseapp.com",
  projectId: "nexify-9c438",
  storageBucket: "nexify-9c438.firebasestorage.app",
  messagingSenderId: "982438156328",
  appId: "1:982438156328:web:8ad2388ff5524b48757d1d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
