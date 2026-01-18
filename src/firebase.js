// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVXjeolA7TAA9eJPFow3ZLdQj98m-MLYU",
    authDomain: "roomquindonesia.firebaseapp.com",
    projectId: "roomquindonesia",
    storageBucket: "roomquindonesia.firebasestorage.app",
    messagingSenderId: "126300204357",
    appId: "1:126300204357:web:ad1f95388fa1cf1218222c"
};

import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
