// scripts/history.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const historyList = document.getElementById('history-list');

function renderHistory(rentals) {
  if (!rentals.length) {
    historyList.innerHTML = "<p>You haven't rented anything yet. Start your first booking now!</p>";
    return;
  }
  historyList.innerHTML = rentals.map(rental => `
    <div class="history-item">
      <h3>${rental.vehicle}</h3>
      <p><strong>City:</strong> ${rental.city}</p>
      <p><strong>From:</strong> ${rental.startDate} <strong>To:</strong> ${rental.endDate}</p>
      <p><strong>Price:</strong> ₹${rental.price}</p>
    </div>
  `).join('');
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    historyList.innerHTML = "<p>Please sign in to view your rental history.</p>";
    return;
  }
  // Query rentals for this user:
  const q = query(
    collection(db, "rentals"),
    where("userId", "==", user.uid),
    orderBy("startDate", "desc")
  );
  try {
    const querySnapshot = await getDocs(q);
    const rentals = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to string if needed
      data.startDate = data.startDate?.toDate ? data.startDate.toDate().toLocaleDateString() : data.startDate;
      data.endDate = data.endDate?.toDate ? data.endDate.toDate().toLocaleDateString() : data.endDate;
      rentals.push(data);
    });
    renderHistory(rentals);
  } catch (err) {
    historyList.innerHTML = "<p>Error loading history.</p>";
    console.error("History error:", err);
  }
});

