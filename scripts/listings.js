import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const fleetItemsContainer = document.querySelector('.fleet-items');
const filterButtons = document.querySelectorAll('.filter-tabs button');
let allListings = [];

async function fetchAndDisplayListings() {
  const querySnapshot = await getDocs(collection(db, 'listings'));
  allListings = [];
  querySnapshot.forEach((doc) => {
    allListings.push({ id: doc.id, ...doc.data() });
  });
  renderListings('all');
}

function renderListings(filter) {
  fleetItemsContainer.innerHTML = '';

  const filtered = filter === 'all'
    ? allListings
    : allListings.filter(item => item.type === filter); // item.type should be 'bike' or 'scooter'

  if (filtered.length === 0) {
    fleetItemsContainer.innerHTML = '<p>No listings found.</p>';
    return;
  }

  filtered.forEach(listing => {
    const card = document.createElement('div');
    card.className = 'fleet-card';
    card.innerHTML = `
      <img src="${listing.image}" alt="${listing.name}" />
      <h3>${listing.name}</h3>
      <p>${listing.price}</p>
      <button class="rent-now-btn">Rent Now</button>
    `;

    const button = card.querySelector('.rent-now-btn');
    button.addEventListener('click', () => {
      localStorage.setItem('selectedVehicle', JSON.stringify(listing));
      window.location.href = 'rent.html';
    });

    fleetItemsContainer.appendChild(card);
  });
}

// Add event listeners to filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-tabs .active')?.classList.remove('active');
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    renderListings(filter);
  });
});

fetchAndDisplayListings();
