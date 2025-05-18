import { db, auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Get vehicle details from localStorage
const vehicle = JSON.parse(localStorage.getItem('selectedVehicle'));
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const signInBtn = document.getElementById('openLogin');
const uploadForm = document.getElementById('uploadForm');
const rentForm = document.getElementById('rentForm');

const vehicleImage = document.getElementById('vehicleImage');
const vehicleName = document.getElementById('vehicleName');
const vehiclePrice = document.getElementById('vehiclePrice');
const vehicleType = document.getElementById('vehicleType');
const vehicleLocation = document.getElementById('vehicleLocation');

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
    usernameDisplay.textContent = user.displayName || user.email || "User";
    logoutBtn.style.display = "inline-block";
    signInBtn.style.display = "none";
  } else {
    currentUser = null;
    usernameDisplay.textContent = "";
    logoutBtn.style.display = "none";
    signInBtn.style.display = "inline-block";
  }
});

// Handle logout
logoutBtn?.addEventListener('click', () => {
  auth.signOut();
});

// Handle booking via uploadForm (if present)
uploadForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("Please sign in to book.");
    return;
  }
  // Use vehicle details from the page
  const vehicleVal = vehicleName.textContent;
  const price = Number(vehiclePrice.textContent.replace(/[^\d]/g, ''));
  const city = vehicleLocation.textContent;
  // For demo: today's date as start, tomorrow as end
  const startDate = new Date().toISOString().slice(0, 10);
  const endDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  try {
    await addDoc(collection(db, "rentals"), {
      userId: currentUser.uid,
      vehicle: vehicleVal,
      startDate,
      endDate,
      city,
      price,
      createdAt: Timestamp.now()
    });
    alert("Booking successful! Check your history page.");
    uploadForm.reset();
  } catch (err) {
    alert("Booking failed: " + err.message);
  }
});

// Handle booking via rentForm (if present)
rentForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("Please sign in to book.");
    return;
  }
  // Get values from your form fields
  const vehicleVal = document.getElementById('vehicleInput').value;
  const startDate = document.getElementById('startDateInput').value;
  const endDate = document.getElementById('endDateInput').value;
  const city = document.getElementById('cityInput').value;
  const price = Number(document.getElementById('priceInput').value);

  try {
    await addDoc(collection(db, "rentals"), {
      userId: currentUser.uid,
      vehicle: vehicleVal,
      startDate,
      endDate,
      city,
      price,
      createdAt: Timestamp.now()
    });
    alert("Rental booked! You can see it in your history.");
    rentForm.reset();
  } catch (err) {
    alert("Booking failed: " + err.message);
  }
});

// Auto-fill booking form fields if vehicle is selected
if (vehicle) {
  const vehicleInput = document.getElementById('vehicleInput');
  const cityInput = document.getElementById('cityInput');
  const priceInput = document.getElementById('priceInput');
  if (vehicleInput) vehicleInput.value = vehicle.name;
  if (cityInput) cityInput.value = vehicle.location || '';
  if (priceInput) priceInput.value = vehicle.price;
}

document.getElementById('triggerAuthPanel')?.addEventListener('click', () => {
  document.getElementById('authPanel')?.classList.add('show');
});
