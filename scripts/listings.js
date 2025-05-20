import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const fleetItemsContainer = document.getElementById('fleet-items');
let allFleetDocs = [];

async function loadFleet(selectedType = "all") {
  try {
    if (allFleetDocs.length === 0) {
      const querySnapshot = await getDocs(collection(db, "listings"));
      allFleetDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    let filteredDocs = allFleetDocs;
    if (selectedType !== "all") {
      filteredDocs = allFleetDocs.filter(doc => doc.type === selectedType);
    }
    let html = '';
    filteredDocs.forEach(data => {
      html += `
        <div class="fleet-card">
          <img src="${data.image}" alt="${data.name}" class="fleet-img" />
          <h3>${data.name}</h3>
          <p>Type: ${data.type}</p>
          <p>Location: ${data.location}</p>
          <p>Price: ₹${data.price}</p>
          <button class="rent-btn" data-id="${data.id}">Rent Now</button>
        </div>
      `;
    });
    fleetItemsContainer.innerHTML = html || "<p>No vehicles found.</p>";

    // Add event listeners to "Rent Now" buttons
    document.querySelectorAll('.rent-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const docId = btn.getAttribute('data-id');
        const docData = allFleetDocs.find(d => d.id === docId);
        if (docData) {
          localStorage.setItem('selectedVehicle', JSON.stringify(docData));
          window.location.href = 'rent.html';
        }
      });
    });
  } catch (err) {
    fleetItemsContainer.innerHTML = "<p>Error loading fleet.</p>";
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFleet();

  // Filter button logic
  document.querySelectorAll('.filter-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-tabs button').forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      const type = btn.getAttribute('data-filter');
      loadFleet(type);
    });
  });
});
