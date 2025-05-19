// scripts/auth.js

import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

import {
  doc,
  setDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

export function initAuth() {
  const openLoginBtn = document.getElementById("openLogin");
  const authPanel = document.getElementById("authPanel");
  const loginPanel = document.getElementById("loginPanel");
  const signupPanel = document.getElementById("signupPanel");
  const closeAuthPanelBtn = document.getElementById("closeAuthPanel");
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");

  if (!openLoginBtn || !authPanel) return;

  openLoginBtn.addEventListener("click", () => {
    authPanel.classList.add("show");
    loginPanel.style.display = "block";
    signupPanel.style.display = "none";
  });

  closeAuthPanelBtn?.addEventListener("click", () => {
    authPanel.classList.remove("show");
  });

  switchToSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    loginPanel.style.display = "none";
    signupPanel.style.display = "block";
  });

  switchToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    signupPanel.style.display = "none";
    loginPanel.style.display = "block";
  });

  forgotPasswordLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
      alert("Please enter your email in the email field above first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  });

  // --- SIGNUP LOGIC ---
  const signupForm = document.getElementById('signupForm');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: new Date().toISOString()
      });
      alert("Signup successful! You can now log in.");
      signupForm.reset();
      signupPanel.style.display = "none";
      loginPanel.style.display = "block";
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  });

  // --- LOGIN LOGIC ---
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) usernameDisplay.textContent = userDoc.data().name;
      }
      authPanel.classList.remove('show');
      loginForm.reset();
      alert("Thank you for logging in! It helps us serve you better.");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });

  // --- LOGOUT LOGIC ---
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', async () => {
    await signOut(auth);
    location.reload();
  });

  // --- AUTH STATE LISTENER ---
  onAuthStateChanged(auth, async (user) => {
    const userMenu = document.getElementById('userMenu');
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) usernameDisplay.textContent = userDoc.data().name;
      }
      if (userMenu) userMenu.style.display = 'flex';
      if (openLoginBtn) openLoginBtn.style.display = 'none';
    } else {
      if (userMenu) userMenu.style.display = 'none';
      if (openLoginBtn) openLoginBtn.style.display = 'inline-block';
    }
  });

  // Example: after user logs in
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('nameInput').value = user.displayName || '';
      document.getElementById('emailInput').value = user.email || '';
      // If you store phone in user profile, use user.phoneNumber
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});
