
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGf06TBKi-wnSoyN1UZijmphts4k8PSzg",
    authDomain: "ojt-journal-static.firebaseapp.com",
    projectId: "ojt-journal-static",
    storageBucket: "ojt-journal-static.firebasestorage.app",
    messagingSenderId: "52274714986",
    appId: "1:52274714986:web:d4387f89c32387d8166d13",
    measurementId: "G-55CHJE9TXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
