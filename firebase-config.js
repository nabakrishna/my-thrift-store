//this server is down
const firebaseConfig = {
  apiKey: "AIzaSyBQCH4CZpiX20CXdzpY_wbAHZoOdLr0uB4",
  authDomain: "thethriftbee.firebaseapp.com",
  projectId: "thethriftbee",
  storageBucket: "thethriftbee.appspot.com",
  messagingSenderId: "1058449030849",
  appId: "1:1058449030849:web:1667f1bd87d7aaf09a9e40",
  measurementId: "G-ZXYMV7TS6Z"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('✓ Firebase initialized successfully');
} catch (error) {
  console.error('✗ Firebase initialization failed:', error);
}

// Get references to services
const auth = firebase.auth();
const db = firebase.firestore();

console.log('✓ Auth service available');
console.log('✓ Firestore service available');

// Enable offline persistence for Firestore (optional but recommended)
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open - persistence disabled');
    } else if (err.code == 'unimplemented') {
        console.warn('⚠️ Browser doesn\'t support persistence');
    }
});

console.log('✅ Firebase config loaded successfully');
