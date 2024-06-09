// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfUVrGxzfKbTdG4_NFDAPuoozgwz44QGg",
  authDomain: "mernblog-8b5ef.firebaseapp.com",
  projectId: "mernblog-8b5ef",
  storageBucket: "mernblog-8b5ef.appspot.com",
  messagingSenderId: "413788816460",
  appId: "1:413788816460:web:459b9629b7538dabdc20e9",
  measurementId: "G-6ZW80B3FEF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const analytics = getAnalytics(app);