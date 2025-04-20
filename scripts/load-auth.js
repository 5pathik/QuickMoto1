// scripts/load-auth.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("components/auth.html")
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);
        setupAuthPanel();
      });
  });
  
  function setupAuthPanel() {
    const openBtn = document.getElementById("openLogin");
    const closeBtn = document.getElementById("closeAuthPanel");
    const panel = document.getElementById("authPanel");
  
    if (openBtn && closeBtn && panel) {
      openBtn.addEventListener("click", () => {
        panel.style.right = "0";
      });
  
      closeBtn.addEventListener("click", () => {
        panel.style.right = "-400px";
      });
    }
  }

  