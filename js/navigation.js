class Navigation {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("Starting navigation initialization");
    // Remove the setupDashboardButton call
    this.setupAuthHandlers();
  }

  setupAuthHandlers() {
    // Only handle auth-related functionality
    document.querySelector("#loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  }

  handleLogin() {
    // Use window.CONFIG instead of local constants
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (
      email === window.CONFIG.AUTH.email &&
      password === window.CONFIG.AUTH.password
    ) {
      // Handle successful login
      sessionStorage.setItem("isAuthenticated", "true");
      window.location.href = window.CONFIG.PAGES.dashboard;
    }
  }
}
