import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB86_DB8hE4o5LlX6ac-0IQyzHZybO5Chw",
  authDomain: "tube-coffee.firebaseapp.com",
  projectId: "tube-coffee",
  storageBucket: "tube-coffee.firebasestorage.app",
  messagingSenderId: "1037905557047",
  appId: "1:1037905557047:web:e8658a72d05a03854e31b2",
  measurementId: "G-NKB2PXPHVJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);