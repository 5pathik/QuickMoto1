window.addEventListener("DOMContentLoaded", () => {
  const cityModal = document.getElementById("cityModal");
  const dateModal = document.getElementById("dateModal");
  const selectedCityDisplay = document.getElementById("selectedCity");

  const selectedCity = localStorage.getItem("selectedCity");
  const selectedDate = localStorage.getItem("selectedDate");

  if (!selectedCity) {
    // First time or reset — show city modal
    cityModal.style.display = "flex";
  } else {
    // Show selected city on page
    if (selectedCityDisplay) selectedCityDisplay.textContent = selectedCity;

    // If date is not selected, show date modal
    if (!selectedDate) {
      dateModal.style.display = "flex";
    }
  }
});

// Handle city selection
document.querySelectorAll(".city-card").forEach(card => {
  card.addEventListener("click", () => {
    const city = card.getAttribute("data-city");
    localStorage.setItem("selectedCity", city);
    const selectedCityDisplay = document.getElementById("selectedCity");
    if (selectedCityDisplay) selectedCityDisplay.textContent = city;

    // Hide city modal
    const cityModal = document.getElementById("cityModal");
    cityModal.style.display = "none";

    // Clear date and show date modal again
    localStorage.removeItem("selectedDate");
    document.getElementById("dateModal").style.display = "flex";
  });
});

// Handle date confirmation
document.getElementById("confirmDateBtn")?.addEventListener("click", () => {
  const dateValue = document.getElementById("datePicker").value;
  if (dateValue) {
    localStorage.setItem("selectedDate", dateValue);
    document.getElementById("dateModal").style.display = "none";
  } else {
    alert("Please select a date.");
  }
});

// Allow manual city change
document.getElementById("changeLocationBtn")?.addEventListener("click", () => {
  document.getElementById("cityModal").style.display = "flex";
});

// Close city modal manually (optional)
document.getElementById("closeCityModal")?.addEventListener("click", () => {
  document.getElementById("cityModal").style.display = "none";
});
