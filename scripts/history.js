// scripts/history.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const historyList = document.getElementById("historyList");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "rentals"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      historyList.innerHTML = "<p>No rental history found.</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement("div");
        item.classList.add("history-item");
        item.innerHTML = `
          <h3>${data.vehicleType} - ${data.city}</h3>
          <p><strong>Start Date:</strong> ${data.startDate}</p>
          <p><strong>End Date:</strong> ${data.endDate}</p>
        `;
        historyList.appendChild(item);
      });
    }
  } else {
    window.location.href = "login.html";
  }
});

