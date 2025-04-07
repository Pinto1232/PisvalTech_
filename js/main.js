// Theme configuration
const THEMES = {
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

class AppUI {
  constructor() {
    this.initializeComponents();
  }

  initializeComponents() {
    this.setupSmoothScrolling();
    this.setupTimelineAnimations();
    this.setupServiceItems();
    this.setupModal();
    this.setupFileUpload();
    this.setupServiceTags();
    this.setupViewOptions();
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // Timeline animations
  setupTimelineAnimations() {
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
      { threshold: 0.1 }
    );

    timelineItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";
      item.style.transition = "all 0.5s ease-out";
      observer.observe(item);
    });
  }

  // Service items hover effects
  setupServiceItems() {
    document.querySelectorAll(".service-item").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateY(-5px)";
        item.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.1)";
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateY(0)";
        item.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
      });
    });
  }

  // Modal functionality
  setupModal() {
    const modal = document.querySelector(".modal");
    const newProposalBtn = document.querySelector(".new-proposal-btn");
    const closeModalBtn = document.querySelector(".close-modal");

    if (!modal || !newProposalBtn || !closeModalBtn) return;

    const toggleModal = () => {
      modal.classList.toggle("active");
      document.body.style.overflow = modal.classList.contains("active")
        ? "hidden"
        : "";
    };

    newProposalBtn.addEventListener("click", toggleModal);
    closeModalBtn.addEventListener("click", toggleModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) toggleModal();
    });
  }

  // File upload functionality
  setupFileUpload() {
    const fileUpload = document.querySelector(".file-upload");
    const fileInput = document.querySelector('.file-upload input[type="file"]');

    if (!fileUpload || !fileInput) return;

    fileUpload.addEventListener("click", () => fileInput.click());

    this.setupDragAndDrop(fileUpload, fileInput);
  }

  setupDragAndDrop(fileUpload, fileInput) {
    const dragEvents = ["dragover", "dragleave", "drop"];

    dragEvents.forEach((eventName) => {
      fileUpload.addEventListener(eventName, (e) => {
        e.preventDefault();
        if (eventName === "dragover") {
          fileUpload.classList.add("drag-over");
        } else {
          fileUpload.classList.remove("drag-over");
        }
      });
    });

    fileUpload.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length) this.handleFileUpload(files[0]);
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) this.handleFileUpload(e.target.files[0]);
    });
  }

  handleFileUpload(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // Handle the uploaded file
      console.log("File loaded:", e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Service tags functionality
  setupServiceTags() {
    const serviceInput = document.querySelector(".service-tags input");
    if (!serviceInput) return;

    serviceInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        this.addServiceTag(e.target.value.trim());
        e.target.value = "";
        e.preventDefault();
      }
    });
  }

  addServiceTag(service) {
    const container = document.querySelector(".service-tags");
    if (!container) return;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.innerHTML = `${service} <i class="ri-close-line"></i>`;
    tag.querySelector("i").addEventListener("click", () => tag.remove());
    container.insertBefore(tag, container.querySelector("input"));
  }

  // View options functionality
  setupViewOptions() {
    const viewOptions = document.querySelectorAll(".view-options button");
    const proposalGrid = document.querySelector(".proposal-grid");

    if (!proposalGrid) return;

    viewOptions.forEach((button) => {
      button.addEventListener("click", () => {
        viewOptions.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        proposalGrid.classList.toggle(
          "list-view",
          button.querySelector(".ri-list-check-2")
        );
      });
    });
  }

  // Theme application
  applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });
  }

  // PDF export functionality
  async exportToPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      console.warn("jsPDF not loaded");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Proposal", 20, 20);
    doc.save("proposal.pdf");
  }
}

// Initialize the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.app = new AppUI();
  });
} else {
  window.app = new AppUI();
}
