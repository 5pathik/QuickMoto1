window.addEventListener("DOMContentLoaded", () => {
  const cityModal = document.getElementById("cityModal");
  const dateModal = document.getElementById("dateModal");
  const selectedCityDisplay = document.getElementById("selectedCity");
  const selectedCity = localStorage.getItem("selectedCity");
  const selectedDate = localStorage.getItem("selectedDate");

  // Step 1: Show city modal only if no city is stored
  if (!selectedCity) {
    cityModal.style.display = "flex";
  } else if (!selectedDate) {
    // Step 2: If city is stored but date is not, show date modal
    selectedCityDisplay.textContent = selectedCity;
    dateModal.style.display = "flex";
  } else {
    // Both are selected
    selectedCityDisplay.textContent = selectedCity;
    document.getElementById("startDate").value = selectedDate;
    document.getElementById("endDate").value = selectedDate;
  }
});

// Step 3: When a city is clicked
document.querySelectorAll(".city-card").forEach(card => {
  card.addEventListener("click", () => {
    const city = card.getAttribute("data-city");
    localStorage.setItem("selectedCity", city);
    document.getElementById("selectedCity").textContent = city;

    document.getElementById("cityModal").style.display = "none";
    document.getElementById("dateModal").style.display = "flex";
  });
});

// Step 4: Confirm date
document.getElementById("confirmDateBtn").addEventListener("click", () => {
  const date = document.getElementById("datePicker").value;
  if (!date) {
    alert("Please select a date.");
    return;
  }

  localStorage.setItem("selectedDate", date);
  document.getElementById("dateModal").style.display = "none";

  // Also update date inputs
  document.getElementById("startDate").value = date;
  document.getElementById("endDate").value = date;
});

// Optional: Change location/date
document.getElementById("changeLocationBtn").addEventListener("click", () => {
  localStorage.removeItem("selectedCity");
  localStorage.removeItem("selectedDate");
  location.reload(); // Will trigger city modal again
});
