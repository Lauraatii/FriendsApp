import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLXu6yhRRzKSjVq9PW-ArjrgBw3cIhHQY",
  authDomain: "friendsapp-76f42.firebaseapp.com",
  projectId: "friendsapp-76f42",
  storageBucket: "friendsapp-76f42.appspot.com",
  messagingSenderId: "685168286735",
  appId: "1:685168286735:web:be9ef994c89820b1d0d77a",
  measurementId: "G-5MJNYMYMKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(app);

export { auth, firestore };
