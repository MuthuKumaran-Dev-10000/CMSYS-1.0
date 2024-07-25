// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-VSO64jlYNhnd90cM6NojUKWM-RVe1HA",
  authDomain: "cmsys-d8b65.firebaseapp.com",
  databaseURL: "https://cmsys-d8b65-default-rtdb.firebaseio.com",
  projectId: "cmsys-d8b65",
  storageBucket: "cmsys-d8b65.appspot.com",
  messagingSenderId: "783871262001",
  appId: "1:783871262001:web:5d88a8d768c8c0521ac410",
  measurementId: "G-SKL9SMS7N3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
const db = getDatabase(app);



export { auth, db };
