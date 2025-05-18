import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const fleetItemsContainer = document.getElementById('fleet-items');

async function loadFleet() {
  try {
    const querySnapshot = await getDocs(collection(db, "listings"));
    let html = '';
    querySnapshot.forEach(doc => {
      const data = doc.data();
      html += `
        <div class="fleet-card">
          <img src="${data.image}" alt="${data.name}" class="fleet-img" />
          <h3>${data.name}</h3>
          <p>Type: ${data.type}</p>
          <p>Location: ${data.location}</p>
          <p>Price: ₹${data.price}</p>
          <button class="rent-btn" data-id="${doc.id}">Rent Now</button>
        </div>
      `;
    });
    fleetItemsContainer.innerHTML = html || "<p>No vehicles found.</p>";

    // Add event listeners to "Rent Now" buttons
    document.querySelectorAll('.rent-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const docId = btn.getAttribute('data-id');
        // Find the vehicle data from the querySnapshot
        const docData = Array.from(querySnapshot.docs).find(d => d.id === docId)?.data();
        if (docData) {
          // Save to localStorage
          localStorage.setItem('selectedVehicle', JSON.stringify(docData));
          // Redirect to rent.html
          window.location.href = 'rent.html';
        }
      });
    });
  } catch (err) {
    fleetItemsContainer.innerHTML = "<p>Error loading fleet.</p>";
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadFleet);
