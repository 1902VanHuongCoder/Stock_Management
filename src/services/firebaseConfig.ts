import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAWhUWaZV6dRduRYobrCJr022i0NibySuI",
    authDomain: "stock-management-6f5e1.firebaseapp.com",
    projectId: "stock-management-6f5e1",
    storageBucket: "stock-management-6f5e1.appspot.com",
    messagingSenderId: "336355897535",
    appId: "1:336355897535:web:982d9436b366e7b1ab960a",
    measurementId: "G-ZDN5ZG9416"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);