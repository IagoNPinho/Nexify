// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAK6QAB9RwwedOq-dbckRIe7vkJAKXq3JI",
  authDomain: "nexify-crm.firebaseapp.com",
  projectId: "nexify-crm",
  storageBucket: "nexify-crm.firebasestorage.app",
  messagingSenderId: "128056060234",
  appId: "1:128056060234:web:9d9eadd4048aeb2449b9b3",
  measurementId: "G-PZTKFKZ6LC"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
