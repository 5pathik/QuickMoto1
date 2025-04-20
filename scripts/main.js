// Show city modal on first load
window.addEventListener("DOMContentLoaded", () => {
  const cityModal = document.getElementById("cityModal");
  const selectedCityDisplay = document.getElementById("selectedCity");

  const selectedCity = localStorage.getItem("selectedCity");
  if (cityModal && !selectedCity) {
    cityModal.style.display = "flex";
  } else if (selectedCityDisplay) {
    selectedCityDisplay.textContent = selectedCity;
  }
});

// Handle city selection
const cityCards = document.querySelectorAll(".city-card");
if (cityCards.length > 0) {
  cityCards.forEach(card => {
    card.addEventListener("click", () => {
      const city = card.getAttribute("data-city");
      localStorage.setItem("selectedCity", city);
      const selectedCityDisplay = document.getElementById("selectedCity");
      if (selectedCityDisplay) selectedCityDisplay.textContent = city;
      const cityModal = document.getElementById("cityModal");
      if (cityModal) cityModal.style.display = "none";
    });
  });
}

// Close city modal manually
const closeCityModal = document.getElementById("closeCityModal");
if (closeCityModal) {
  closeCityModal.addEventListener("click", () => {
    const cityModal = document.getElementById("cityModal");
    if (cityModal) cityModal.style.display = "none";
  });
}

// Allow changing location later
const changeLocationBtn = document.getElementById("changeLocationBtn");
if (changeLocationBtn) {
  changeLocationBtn.addEventListener("click", () => {
    const cityModal = document.getElementById("cityModal");
    if (cityModal) cityModal.style.display = "flex";
  });
}

// Open auth panel
const openLogin = document.getElementById("openLogin");
const authPanel = document.getElementById("authPanel");

if (openLogin && authPanel) {
  openLogin.addEventListener("click", () => {
    authPanel.style.display = "flex";
  });
}
