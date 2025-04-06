// Authentication state
const AUTH_EMAIL = "pintotnet@gmail.com";
const AUTH_PASSWORD = "password";

// Initialize the home page
function initializeHome() {
  console.log("Initializing home page...");

  const urlParams = new URLSearchParams(window.location.search);
  const proposalId = parseInt(urlParams.get("proposal"));

  if (proposalId) {
    renderProposal(proposalId);
  }

  // Setup dashboard button
  setupDashboardButton();
}

// Setup dashboard button functionality
function setupDashboardButton() {
  const dashboardBtn = document.getElementById("dashboardBtn");
  console.log("Setting up dashboard button:", dashboardBtn);

  if (dashboardBtn) {
    // Remove any existing listeners
    const newBtn = dashboardBtn.cloneNode(true);
    dashboardBtn.parentNode.replaceChild(newBtn, dashboardBtn);

    // Add click event listener
    newBtn.addEventListener("click", (e) => {
      console.log("Dashboard button clicked");
      handleDashboardClick(e);
    });

    console.log("Dashboard button click listener added");
  } else {
    console.warn("Dashboard button not found in the DOM");
  }
}

// Handle dashboard button click
function handleDashboardClick(e) {
  console.log("Dashboard button clicked - handling click event");
  e.preventDefault();
  e.stopPropagation();

  // Remove any existing dropdown
  const existingDropdown = document.querySelector(".login-dropdown");
  if (existingDropdown) {
    console.log("Removing existing dropdown");
    existingDropdown.remove();
  }

  // Show login dropdown
  showLoginDropdown(e.currentTarget);
}

// Create and show login dropdown
function showLoginDropdown(button) {
  console.log("Creating login dropdown");

  // Create dropdown element
  const dropdown = document.createElement("div");
  dropdown.className = "login-dropdown";
  dropdown.style.cssText = `
    position: fixed;
    z-index: 9999;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    display: block;
  `;

  // Create dropdown content
  dropdown.innerHTML = `
    <form id="loginForm" style="padding: 24px; min-width: 320px;">
      <div class="form-group">
        <label for="email" style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required 
               style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 4px;">
        <div class="input-hint" style="font-size: 12px; color: #6b7280;">Use: pintotnet@gmail.com</div>
      </div>
      <div class="form-group" style="margin-top: 16px;">
        <label for="password" style="display: block; margin-bottom: 8px; font-weight: 500;">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" required
               style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 4px;">
        <div class="input-hint" style="font-size: 12px; color: #6b7280;">Use: password</div>
      </div>
      <div class="error-message" style="color: #dc2626; margin: 8px 0; min-height: 20px;"></div>
      <button type="submit" style="
        width: 100%;
        padding: 10px;
        background: linear-gradient(to right, #2563eb, #3b82f6);
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
      ">
        <i class="ri-login-box-line"></i>
        Login
      </button>
    </form>
  `;

  // Add dropdown to body
  document.body.appendChild(dropdown);

  // Position the dropdown
  const buttonRect = button.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect();

  // Calculate position
  const top = buttonRect.bottom + window.scrollY + 8;
  const left = Math.max(
    0,
    Math.min(
      buttonRect.left + window.scrollX,
      window.innerWidth - dropdownRect.width
    )
  );

  // Set position
  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;

  console.log("Dropdown positioned at:", { top, left });

  // Setup form handling
  const loginForm = dropdown.querySelector("#loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin();
  });

  // Setup click outside handling
  const handleClickOutside = (e) => {
    if (!dropdown.contains(e.target) && e.target !== button) {
      console.log("Clicked outside dropdown - removing");
      dropdown.remove();
      document.removeEventListener("click", handleClickOutside);
    }
  };

  // Delay adding the click outside listener to prevent immediate triggering
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 100);

  // Focus email input
  setTimeout(() => {
    const emailInput = dropdown.querySelector("#email");
    if (emailInput) {
      emailInput.focus();
    }
  }, 100);
}

// Handle login submission
function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMessage = document.querySelector(".error-message");
  const loginBtn = document.querySelector(".login-submit");

  // Disable button and show loading state
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="ri-loader-4-line"></i> Logging in...';

  // Simulate API call
  setTimeout(() => {
    if (email === AUTH_EMAIL && password === AUTH_PASSWORD) {
      errorMessage.textContent = "";
      errorMessage.style.color = "#059669";
      errorMessage.textContent = "Login successful! Redirecting...";

      // Store auth state
      sessionStorage.setItem("isAuthenticated", "true");

      // Navigate to dashboard
      setTimeout(() => {
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf("/"));
        const dashboardPath = basePath + "/dashboard.html";
        window.location.href = dashboardPath;
      }, 1000);
    } else {
      loginBtn.disabled = false;
      loginBtn.innerHTML = "<i class='ri-login-box-line'></i> Login";
      errorMessage.style.color = "#dc2626";
      errorMessage.textContent = "Invalid email or password. Please try again.";

      // Shake effect on error
      const dropdown = document.querySelector(".login-dropdown-content");
      dropdown.style.animation = "shake 0.5s ease";
      setTimeout(() => {
        dropdown.style.animation = "";
      }, 500);
    }
  }, 1000);
}

// Render specific proposal
function renderProposal(id) {
  const proposal = window.proposalManager.getProposal(id);
  if (!proposal) return;

  // Update page title
  document.title = `${proposal.title} - ${proposal.client}`;

  // Update header information
  document.querySelector("header h1").textContent =
    proposal.title.toUpperCase();
  document.querySelector(
    "header .subtitle"
  ).textContent = `Professional Solution for ${proposal.client}`;

  // Update proposal info
  const proposalInfo = document.querySelector(".proposal-info");
  if (proposalInfo) {
    proposalInfo.innerHTML = `
            <div>
                <h3>Prepared By</h3>
                <p>Pisval Tech</p>
            </div>
            <div>
                <h3>Prepared For</h3>
                <p>${proposal.client}</p>
            </div>
            <div>
                <h3>Date</h3>
                <p>${proposal.date}</p>
            </div>
            <div>
                <h3>Valid Until</h3>
                <p>${getValidUntilDate(proposal.date)}</p>
            </div>
        `;
  }

  // Update investment table
  if (proposal.investment) {
    const investmentTable = document.querySelector("section table tbody");
    if (investmentTable) {
      let total = 0;
      const rows = Object.entries(proposal.investment)
        .map(([key, value]) => {
          total += value;
          return `
                    <tr>
                        <td>${formatInvestmentKey(key)}</td>
                        <td>${getInvestmentDescription(key)}</td>
                        <td>$${value.toLocaleString()}</td>
                    </tr>
                `;
        })
        .join("");

      // Add total row
      rows += `
                <tr>
                    <td><strong>Total Investment</strong></td>
                    <td></td>
                    <td><strong>$${total.toLocaleString()}</strong></td>
                </tr>
            `;

      investmentTable.innerHTML = rows;
    }
  }

  // Update timeline
  if (proposal.timeline) {
    const timeline = document.querySelector(".timeline");
    if (timeline) {
      const timelineHTML = Object.entries(proposal.timeline)
        .map(
          ([phase, data]) => `
                <div class="timeline-item">
                    <div class="timeline-phase">${formatTimelinePhase(
                      phase
                    )}</div>
                    <div class="timeline-duration">${data.duration}</div>
                    <div class="timeline-details">${data.details}</div>
                </div>
            `
        )
        .join("");

      timeline.innerHTML = timelineHTML;
    }
  }
}

// Helper functions
function getValidUntilDate(date) {
  const proposalDate = new Date(date);
  proposalDate.setDate(proposalDate.getDate() + 30);
  return proposalDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatInvestmentKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInvestmentDescription(key) {
  const descriptions = {
    discovery: "Requirements gathering, sitemap creation",
    design: "Custom responsive design for all devices",
    development: "Front-end and back-end implementation",
    industryFeatures: "Industry-specific functionality",
    seoMarketing: "Basic SEO setup and optimization",
    qualityAssurance: "Testing and refinement",
    trainingDeployment: "Launch and knowledge transfer",
  };
  return descriptions[key] || "";
}

function formatTimelinePhase(phase) {
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Add animation to timeline items
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".timeline-item").forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateX(-20px)";
  item.style.transition = "all 0.5s ease-out";
  observer.observe(item);
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");
  console.log("Current page location:", window.location.href);
  initializeHome();
});

// Add hover effect to service items
const serviceItems = document.querySelectorAll(".service-item");

serviceItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateY(-5px)";
    item.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.1)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateY(0)";
    item.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
  });
});
