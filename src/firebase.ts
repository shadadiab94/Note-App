
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyCHjA0eiX8CxqWC3kPR-vtr9IakvIAObSQ",
  authDomain: "notes-95e9c.firebaseapp.com",
  projectId: "notes-95e9c",
  storageBucket: "notes-95e9c.firebasestorage.app",
  messagingSenderId: "89711365012",
  appId: "1:89711365012:web:bb9512135a0ac3cd685d81",
  measurementId: "G-98R5G2NFK0"
};

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


export { db };