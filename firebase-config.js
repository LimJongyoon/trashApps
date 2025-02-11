// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATT5WPggjVXS4oJHPh3Pml0Aijyf_yXL0",
    authDomain: "trashapps-97675.firebaseapp.com",
    databaseURL: "https://trashapps-97675-default-rtdb.firebaseio.com",
    projectId: "trashapps-97675",
    storageBucket: "trashapps-97675.firebasestorage.app",
    messagingSenderId: "559756184244",
    appId: "1:559756184244:web:9cb7f070efe23f2ca865e1",
    measurementId: "G-4S269L1F50"
};

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to sanitize IP (replace "." with "_")
function sanitizeIP(ip) {
    return ip.replace(/\./g, '_');
}

// Function to track views using unique IPs
async function recordView() {
    const response = await fetch('https://api64.ipify.org?format=json');
    const rawIP = (await response.json()).ip;
    const sanitizedIP = sanitizeIP(rawIP);

    // Get current date
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Firebase references
    const viewsRef = ref(db, `views/${date}/${sanitizedIP}`);
    const totalViewsRef = ref(db, `totalViews/${month}`);

    // Check if this IP already viewed today
    get(viewsRef).then((snapshot) => {
        if (!snapshot.exists()) {
            // Store sanitized IP to mark as counted for today
            set(viewsRef, true);

            // Increment total views for the month
            get(totalViewsRef).then((countSnap) => {
                const currentViews = countSnap.exists() ? countSnap.val() : 0;
                set(totalViewsRef, currentViews + 1);
            });
        }
    }).catch(error => {
        console.error("Firebase read/write error: ", error);
    });
}

// Automatically call recordView on page load
recordView();
