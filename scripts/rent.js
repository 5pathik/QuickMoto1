import { auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const vehicle = JSON.parse(localStorage.getItem('selectedVehicle'));
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const signInBtn = document.getElementById('signInBtn');
const loginOverlay = document.getElementById('loginOverlay');
const uploadForm = document.getElementById('uploadForm');

const vehicleImage = document.getElementById('vehicleImage');
const vehicleName = document.getElementById('vehicleName');
const vehiclePrice = document.getElementById('vehiclePrice');
const vehicleType = document.getElementById('vehicleType');
const vehicleLocation = document.getElementById('vehicleLocation');

const authPanel = document.getElementById('authPanel');
const triggerAuthPanel = document.getElementById('triggerAuthPanel');
const closeAuthPanel = document.getElementById('closeAuthPanel');

let currentUser = null;

// Display vehicle details
if (vehicle) {
  vehicleImage.src = vehicle.image;
  vehicleName.textContent = vehicle.name;
  vehiclePrice.textContent = vehicle.price;
  vehicleType.textContent = vehicle.type || 'Not specified';
  vehicleLocation.textContent = vehicle.location || 'Unknown';
} else {
  vehicleName.textContent = "No vehicle selected.";
}

// Check login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    usernameDisplay.textContent = user.displayName || "User";
    logoutBtn.style.display = "inline-block";
    signInBtn.style.display = "none";
    loginOverlay.classList.add("hidden");
    authPanel.classList.remove("show");
  } else {
    currentUser = null;
    usernameDisplay.textContent = "";
    logoutBtn.style.display = "none";
    signInBtn.style.display = "inline-block";
    loginOverlay.classList.remove("hidden");
  }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Upload form
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please log in to continue.");
    return;
  }

  const aadhaar = document.getElementById('aadhaarFile').files[0];
  const license = document.getElementById('licenseFile').files[0];

  if (!aadhaar || !license) {
    alert("Please upload both Aadhaar and Driving License.");
    return;
  }

  // Simulated success
  alert("Booking submitted successfully!");
  uploadForm.reset();
});

// ➕ Open slide-in login panel when clicking "Sign In"
if (triggerAuthPanel && authPanel) {
  triggerAuthPanel.addEventListener('click', () => {
    authPanel.classList.add('show');
    // Do NOT hide the overlay here
  });
}

// ❌ Close slide-in panel, but keep overlay if not logged in
if (closeAuthPanel && authPanel) {
  closeAuthPanel.addEventListener('click', () => {
    authPanel.classList.remove('show');
    if (!currentUser) {
      loginOverlay.classList.remove('hidden');
    }
  });
}
