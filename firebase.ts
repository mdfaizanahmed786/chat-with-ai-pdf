// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaNwi_v3VbWiC-3LFAEgZQ_Dnl3zt22VE",
  authDomain: "chat-with-pdf-7ed72.firebaseapp.com",
  projectId: "chat-with-pdf-7ed72",
  storageBucket: "chat-with-pdf-7ed72.appspot.com",
  messagingSenderId: "92505600453",
  appId: "1:92505600453:web:33317160ac0c2398c3dbac"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };