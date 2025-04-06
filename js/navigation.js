// Navigation System
class Navigation {
  constructor() {
    console.log("Navigation system initialized");
    this.pages = {
      home: "index.html",
      dashboard: "dashboard.html",
    };
    this.init();
  }

  init() {
    console.log("Setting up click listeners");
    const dashboardBtn = document.getElementById("dashboardBtn");

    if (dashboardBtn) {
      console.log("Found dashboard button:", dashboardBtn);

      // Remove any existing click listeners
      const newBtn = dashboardBtn.cloneNode(true);
      dashboardBtn.parentNode.replaceChild(newBtn, dashboardBtn);

      console.log("Added fresh button:", newBtn);

      // Add new click listener
      newBtn.addEventListener("click", (e) => {
        console.log("Button clicked - event details:", {
          target: e.target,
          currentTarget: e.currentTarget,
          type: e.type,
          timestamp: e.timeStamp,
        });

        e.preventDefault();
        e.stopPropagation();

        const page = newBtn.dataset.navigate;
        console.log("Navigating to page:", page);

        if (this.pages[page]) {
          console.log("Found page in pages object:", this.pages[page]);
          console.log("Current location:", window.location.href);
          window.location.href = this.pages[page];
        } else {
          console.error("Page not found in pages object:", page);
        }
      });
    } else {
      console.error("Dashboard button not found in DOM");
    }
  }
}

// Initialize navigation
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded, initializing navigation");
  window.navigation = new Navigation();
});
