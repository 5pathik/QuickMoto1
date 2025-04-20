import { auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const loginWarning = document.getElementById('loginWarning');
const mainContent = document.getElementById('mainContent');
const vehicleInfo = document.getElementById('vehicleInfo');
const uploadForm = document.getElementById('uploadForm');

let currentUser = null;

// Display vehicle details
function showVehicleDetails() {
  const selected = JSON.parse(localStorage.getItem('selectedVehicle'));
  if (!selected) {
    vehicleInfo.innerHTML = "<p>No vehicle selected.</p>";
    return;
  }

  vehicleInfo.innerHTML = `
    <img src="${selected.image}" alt="${selected.name}" style="width:100%; max-width:400px; border-radius:10px;"/>
    <h3>${selected.name}</h3>
    <p><strong>Price:</strong> ${selected.price}</p>
    <p><strong>Location:</strong> ${selected.location || "Not available"}</p>
  `;
}

// Watch auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginWarning.style.display = "none";
    mainContent.classList.remove("blur-overlay");
  } else {
    loginWarning.style.display = "flex";
    mainContent.classList.add("blur-overlay");
  }

  showVehicleDetails();
});

// Handle ID uploads
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please log in before submitting your ID proofs.");
    return;
  }

  const aadhaar = document.getElementById('aadhaarFile').files[0];
  const license = document.getElementById('licenseFile').files[0];

  if (!aadhaar || !license) {
    alert("Please upload both Aadhaar and Driving License.");
    return;
  }

  // For now we simulate the booking submission
  alert("Booking submitted successfully!");
  uploadForm.reset();
});
