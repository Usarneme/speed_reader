import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/auth';
import {  FIREBASE_API_KEY,
          FIREBASE_AUTH_DOMAIN,
          FIREBASE_PROJECT_ID,
          FIREBASE_STORAGE_BUCKET,
          FIREBASE_MESSAGING_SENDER_ID,
          FIREBASE_APP_ID,
          FIREBASE_MEASUREMENT_ID } from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

console.log('FIREBASE CHECK', FIREBASE_API_KEY)

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
