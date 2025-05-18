// scripts/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBAVYCCyV86Jfljd3lywsqazHenR9tHPdg",
  authDomain: "quickmoto-75b19.firebaseapp.com",
  projectId: "quickmoto-75b19",
  storageBucket: "quickmoto-75b19.appspot.com",
  messagingSenderId: "690316789096",
  appId: "1:690316789096:web:591cd569672b3a14a382dd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
