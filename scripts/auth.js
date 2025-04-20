// scripts/auth.js
import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("Auth.js loaded");

  const openLoginBtn = document.getElementById('openLogin');
  const authPanel = document.getElementById('authPanel');
  const loginPanel = document.getElementById('loginPanel');
  const signupPanel = document.getElementById('signupPanel');
  const closeAuthPanelBtn = document.getElementById('closeAuthPanel');
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const userMenu = document.getElementById('userMenu');
  const logoutBtn = document.getElementById('logoutBtn');

  // Open login panel
  openLoginBtn?.addEventListener('click', () => {
    authPanel?.classList.add('show');
    loginPanel.style.display = 'block';
    signupPanel.style.display = 'none';
  });

  // Close auth panel
  closeAuthPanelBtn?.addEventListener('click', () => {
    authPanel?.classList.remove('show');
  });

  // Switch between login/signup
  switchToSignup?.addEventListener('click', () => {
    loginPanel.style.display = 'none';
    signupPanel.style.display = 'block';
  });

  switchToLogin?.addEventListener('click', () => {
    signupPanel.style.display = 'none';
    loginPanel.style.display = 'block';
  });

  // Handle signup
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: new Date().toISOString()
      });
      authPanel.classList.remove('show');
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  });

  // Handle login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        usernameDisplay.textContent = userDoc.data().name;
      }
      authPanel.classList.remove('show');
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });

  // Handle logout
  logoutBtn?.addEventListener('click', async () => {
    await signOut(auth);
    location.reload(); // Refresh page on logout
  });

  // Watch auth state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        usernameDisplay.textContent = userDoc.data().name;
      }
      userMenu.style.display = 'flex';
      openLoginBtn.style.display = 'none';
    } else {
      userMenu.style.display = 'none';
      openLoginBtn.style.display = 'inline-block';
    }
  });
});
