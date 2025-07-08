// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALRYU_I6DAfYTfSOQYZNZqw43XK0ZlhJM",
  authDomain: "dev-pla.firebaseapp.com",
  projectId: "dev-pla",
  storageBucket: "dev-pla.firebasestorage.app",
  messagingSenderId: "710907599444",
  appId: "1:710907599444:web:33fd60ba799ebddea9ebc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);