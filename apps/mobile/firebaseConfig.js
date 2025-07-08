import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as SecureStore from "expo-secure-store"

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDWsE0B9Fg57-FABkUnSC4512-BDlTCuN8',
  authDomain: 'dev-pla.firebaseapp.com',
  projectId: 'dev-pla',
  storageBucket: 'dev-pla.firebasestorage.app',
  messagingSenderId: '710907599444',
  appId: '1:710907599444:android:9cb6717db518643ba9ebc1',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
