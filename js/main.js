// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add animation to timeline items when they come into view
const timelineItems = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateX(0)";
      }
    });
  },
  {
    threshold: 0.1,
  }
);

timelineItems.forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateX(-20px)";
  item.style.transition = "all 0.5s ease-out";
  observer.observe(item);
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

// DOM Elements
const newProposalBtn = document.querySelector(".new-proposal-btn");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const fileUpload = document.querySelector(".file-upload");
const fileInput = document.querySelector('.file-upload input[type="file"]');
const serviceTagsContainer = document.querySelector(".service-tags");
const serviceInput = document.querySelector(".service-tags input");
const viewOptions = document.querySelectorAll(".view-options button");
const proposalGrid = document.querySelector(".proposal-grid");

// Modal Functionality
function toggleModal() {
  modal.classList.toggle("active");
  document.body.style.overflow = modal.classList.contains("active")
    ? "hidden"
    : "";
}

newProposalBtn.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) toggleModal();
});

// File Upload
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
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length) {
    handleFileUpload(e.target.files[0]);
  }
});

function handleFileUpload(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file");
    return;
  }
  // Handle the file upload
  const reader = new FileReader();
  reader.onload = (e) => {
    // Preview the image or handle the upload
    console.log("File loaded:", e.target.result);
  };
  reader.readAsDataURL(file);
}

// Service Tags
serviceInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value.trim()) {
    addServiceTag(e.target.value.trim());
    e.target.value = "";
    e.preventDefault();
  }
});

function addServiceTag(service) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.innerHTML = `${service} <i class="ri-close-line"></i>`;
  tag.querySelector("i").addEventListener("click", () => tag.remove());
  serviceTagsContainer.insertBefore(tag, serviceInput);
}

// View Options
viewOptions.forEach((button) => {
  button.addEventListener("click", () => {
    viewOptions.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Toggle between grid and list view
    if (button.querySelector(".ri-list-check-2")) {
      proposalGrid.classList.add("list-view");
    } else {
      proposalGrid.classList.remove("list-view");
    }
  });
});

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

  // Add content to PDF
  doc.setFontSize(20);
  doc.text("Proposal", 20, 20);

  // Save the PDF
  doc.save("proposal.pdf");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize any necessary features
  console.log("App initialized");
});
