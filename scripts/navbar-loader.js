fetch('components/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
    // After navbar is loaded, load the auth panel
    fetch('components/auth.html')
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);
        import('./auth.js').then(mod => {
          if (mod && mod.initAuth) mod.initAuth();
        });
      });
  })
  .catch(err => console.error('Failed to load navbar:', err));
