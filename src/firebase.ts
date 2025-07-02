// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM6MN__48RJX7qEogIHLKB0pl9sDR1840",
  authDomain: "mypwaapp-b385b.firebaseapp.com",
  projectId: "mypwaapp-b385b",
  storageBucket: "mypwaapp-b385b.firebasestorage.app",
  messagingSenderId: "388926845795",
  appId: "1:388926845795:web:e9c63694d1af802897d956"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export { messaging };
