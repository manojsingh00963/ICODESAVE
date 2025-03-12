// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoPB6Ef6XD7P8jxXzS9O5f_aY_ZWIohyE",
  authDomain: "icodesave-4c421.firebaseapp.com",
  projectId: "icodesave-4c421",
  storageBucket: "icodesave-4c421.firebasestorage.app",
  messagingSenderId: "821768606786",
  appId: "1:821768606786:web:4fadae08fb00726debc9db",
  measurementId: "G-TZXLG53TQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);