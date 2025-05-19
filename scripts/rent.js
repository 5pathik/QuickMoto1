import { db, auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { collection, addDoc, Timestamp, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

// Example: after user logs in
auth.onAuthStateChanged(async user => {
  if (user) {
    // Fetch user details from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      document.getElementById('nameInput').value = data.name || '';
      document.getElementById('emailInput').value = data.email || '';
      document.getElementById('phoneInput').value = data.phone || '';
    } else {
      // Fallback to auth info
      document.getElementById('nameInput').value = user.displayName || '';
      document.getElementById('emailInput').value = user.email || '';
      document.getElementById('phoneInput').value = user.phoneNumber || '';
    }

    // Auto-fill date fields with today and tomorrow
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    document.getElementById('startDateInput').value = today;
    document.getElementById('endDateInput').value = tomorrow;
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

  // Show thank you popup
  alert("Thank you for booking! You will receive your vehicle registration number on WhatsApp shortly.");

  // Collect booking details from the form
  const name = document.getElementById('nameInput').value;
  const phoneNum = document.getElementById('phoneInput').value;
  const startDate = document.getElementById('startDateInput').value;
  const endDate = document.getElementById('endDateInput').value;

  // WhatsApp message
  const phone = "919690914381"; // Your WhatsApp number
  const message = encodeURIComponent(
    `Hello QuickMoto,\nI have booked a vehicle.\n\nBooking Details:\nName: ${name}\nPhone: ${phoneNum}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nCan you please send me the payment link?`
  );
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
