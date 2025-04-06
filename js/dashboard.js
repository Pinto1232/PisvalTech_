// DOM Elements
const newProposalBtn = document.querySelector("#createProposalBtn");
const modal = document.querySelector("#newProposalModal");
const closeModalBtn = document.querySelector(".close-modal");
const modalCancelBtn = document.querySelector(".modal-footer .btn-secondary");
const createProposalBtn = document.querySelector(".modal-footer .btn-primary");
const fileUpload = document.querySelector(".file-upload");
const fileInput = document.querySelector('.file-upload input[type="file"]');
const serviceTagsContainer = document.querySelector(".service-tags");
const serviceInput = document.querySelector(".service-tags input");
const viewOptions = document.querySelectorAll(".view-options button");
const proposalGrid = document.querySelector(".proposal-grid");
const newProposalCard = document.querySelector(".new-card");
const searchInput = document.querySelector(".search-bar input");
const proposalCards = document.querySelectorAll(
  ".proposal-card:not(.new-card)"
);

// Check authentication before initializing
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// Initialize dashboard
function initializeDashboard() {
  if (!checkAuth()) return;

  renderProposals();
  setupEventListeners();
}

// Render all proposals
function renderProposals() {
  const proposals = window.proposalManager.getAllProposals();
  const proposalHTML = proposals
    .map(
      (proposal) => `
        <div class="proposal-card" data-id="${proposal.id}">
            <div class="card-header">
                <img src="${proposal.clientLogo}" alt="${proposal.client}">
                <div class="status-badge ${proposal.status}">${
        proposal.status
      }</div>
            </div>
            <div class="card-content">
                <h3>${proposal.title}</h3>
                <p>${proposal.client}</p>
                <div class="card-meta">
                    <span><i class="ri-calendar-line"></i> ${
                      proposal.date
                    }</span>
                    <span><i class="ri-money-dollar-circle-line"></i> $${proposal.amount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // Add the "Create New Proposal" card at the beginning
  const newCardHTML = `
        <div class="proposal-card new-card" id="newProposalCard">
            <div class="card-content">
                <i class="ri-add-circle-line"></i>
                <h3>Create New Proposal</h3>
                <p>Start from scratch or use a template</p>
            </div>
        </div>
    `;

  proposalGrid.innerHTML = newCardHTML + proposalHTML;
  setupProposalCardListeners();
}

// Setup Event Listeners
function setupEventListeners() {
  // Modal events
  if (newProposalBtn) {
    newProposalBtn.addEventListener("click", toggleModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", toggleModal);
  }
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", toggleModal);
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) toggleModal();
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  // Create proposal form submission
  if (createProposalBtn) {
    createProposalBtn.addEventListener("click", handleCreateProposal);
  }

  // Listen for proposal updates
  window.proposalManager.addListener(() => {
    renderProposals();
  });
}

// Handle proposal creation
function handleCreateProposal() {
  const formData = getFormData();
  if (validateFormData(formData)) {
    window.proposalManager.addProposal(formData);
    toggleModal();
    clearForm();
  }
}

// Get form data
function getFormData() {
  return {
    title: document.querySelector('input[name="title"]').value,
    client: document.querySelector('input[name="client"]').value,
    amount:
      parseFloat(document.querySelector('input[name="amount"]').value) || 0,
    date: document.querySelector('input[name="date"]').value,
    status: "draft",
    clientLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      document.querySelector('input[name="client"]').value
    )}&background=6366f1&color=fff`,
  };
}

// Validate form data
function validateFormData(data) {
  if (!data.title || !data.client || !data.amount || !data.date) {
    alert("Please fill in all required fields");
    return false;
  }
  return true;
}

// Clear form
function clearForm() {
  const form = modal.querySelector("form");
  if (form) form.reset();
}

// Handle search
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".proposal-card:not(.new-card)");

  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const client = card.querySelector("p").textContent.toLowerCase();

    if (title.includes(searchTerm) || client.includes(searchTerm)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Setup proposal card listeners
function setupProposalCardListeners() {
  const cards = document.querySelectorAll(".proposal-card:not(.new-card)");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      const proposal = window.proposalManager.getProposal(id);
      if (proposal) {
        window.location.href = `index.html?proposal=${id}`;
      }
    });

    // Hover effects
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });

  // New proposal card click
  const newCard = document.querySelector("#newProposalCard");
  if (newCard) {
    newCard.addEventListener("click", toggleModal);
  }
}

// Modal toggle
function toggleModal() {
  if (modal) {
    modal.classList.toggle("active");
    document.body.style.overflow = modal.classList.contains("active")
      ? "hidden"
      : "";
  }
}

// File Upload
if (fileUpload) {
  fileUpload.addEventListener("click", () => fileInput.click());
  fileUpload.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileUpload.classList.add("drag-over");
  });
  fileUpload.addEventListener("dragleave", () => {
    fileUpload.classList.remove("drag-over");
  });
  fileUpload.addEventListener("drop", (e) => {
    e.preventDefault();
    fileUpload.classList.remove("drag-over");
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  });
}

if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFileUpload(e.target.files[0]);
    }
  });
}

function handleFileUpload(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log("File loaded:", e.target.result);
  };
  reader.readAsDataURL(file);
}

// Service Tags
if (serviceInput) {
  serviceInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      addServiceTag(e.target.value.trim());
      e.target.value = "";
      e.preventDefault();
    }
  });
}

function addServiceTag(service) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.innerHTML = `${service} <i class="ri-close-line"></i>`;
  tag.querySelector("i").addEventListener("click", () => tag.remove());
  serviceTagsContainer.insertBefore(tag, serviceInput);
}

// View Options
if (viewOptions.length) {
  viewOptions.forEach((button) => {
    button.addEventListener("click", () => {
      viewOptions.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      if (button.querySelector(".ri-list-check-2")) {
        proposalGrid.classList.add("list-view");
      } else {
        proposalGrid.classList.remove("list-view");
      }
    });
  });
}

// Theme Customization
const themes = {
  modern: {
    primary: "#2563eb",
    secondary: "#3b82f6",
    accent: "#6366f1",
  },
  corporate: {
    primary: "#0f766e",
    secondary: "#14b8a6",
    accent: "#0d9488",
  },
  minimal: {
    primary: "#18181b",
    secondary: "#27272a",
    accent: "#3f3f46",
  },
};

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--accent", theme.accent);
}

// Export to PDF
async function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Proposal", 20, 20);
  doc.save("proposal.pdf");
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeDashboard);
