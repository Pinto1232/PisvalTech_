// c:\Users\pinto\Documents\Development\PisvalTech_\js\dashboard.js
// DOM Elements
const newProposalBtn = document.querySelector("#createProposalBtn");
const modal = document.querySelector("#newProposalModal");
const closeModalBtn = document.querySelector(".close-modal");
const modalCancelBtn = document.querySelector(".modal-footer .btn-secondary");
const fileUpload = document.querySelector(".file-upload");
const fileInput = document.querySelector('.file-upload input[type="file"]');
const serviceTagsContainer = document.querySelector(".service-tags");
const serviceInput = document.querySelector(".service-tags input");
const viewOptions = document.querySelectorAll(".view-options button");
const proposalGrid = document.querySelector(".proposal-grid");
const newProposalCard = document.querySelector(".new-card");
const searchInput = document.querySelector(".search-bar input");
const proposalCards = document.querySelectorAll(".proposal-card:not(.new-card)");

class Dashboard {
    constructor() {
        if (this.checkAuthentication() && this.checkForProposalId()) {
            this.initializeComponents();
            this.checkIfSigned();
            this.setupResetButton();
            this.setupMessageListener();
            this.setupResetAllButton();
        }
    }

    setupMessageListener() {
        window.addEventListener('message', (event) => {
            // Security check (optional): Verify message origin
            // if (event.source !== window.opener) return;

            if (event.data.type === 'proposalSigned') {
                const { proposalId } = event.data;
                console.log(`Received 'proposalSigned' message for proposalId: ${proposalId}`);
                this.updateProposalStatusUI(proposalId, true);
                this.renderProposals(); // Re-render to reflect changes
            } else if (event.data.type === 'proposalCreated') {
                const { proposal } = event.data;
                this.handleProposalCreated(proposal);
            }
        });
    }

    handleProposalCreated(proposal) {
        console.log('Received proposalCreated message:', proposal);
        window.proposalManager.addProposal(proposal);
        this.renderProposals();
    }


    updateProposalStatusUI(proposalId, isSigned) {
        const proposalCard = document.querySelector(`.proposal-card[data-id="${proposalId}"]`);
        if (proposalCard) {
            const statusBadge = proposalCard.querySelector(".status-badge");
            if (statusBadge) {
                statusBadge.textContent = isSigned ? "Signed" : "Pending";
                statusBadge.classList.remove("pending", "draft", "approved"); // Remove all classes first
                statusBadge.classList.add(isSigned ? "approved" : "pending");
            }
        }
    }

    setupResetButton() {
        const resetBtn = document.getElementById('resetStatusBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetProposalStatus());
        }
    }

    setupResetAllButton() {
        const resetAllBtn = document.getElementById('resetAllBtn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => this.resetAllProposals());
        }
    }

    resetAllProposals() {
        const proposals = window.proposalManager.getAllProposals();
        proposals.forEach(proposal => {
            localStorage.removeItem(`isSigned-${proposal.id}`);
            window.proposalManager.updateProposalStatus(proposal.id, 'pending');
        });
        this.renderProposals();
        console.log('All proposals reset to pending');
    }


    resetProposalStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const proposalId = parseInt(urlParams.get('proposal'));

        if (proposalId) {
            localStorage.removeItem(`isSigned-${proposalId}`);
            if (window.proposalManager) {
                window.proposalManager.updateProposalStatus(proposalId, 'pending');
            }
            this.updateProposalStatusUI(proposalId, false);
            this.renderProposals();
            console.log(`Proposal ${proposalId} status reset to pending`);
        }
    }

    checkForProposalId() {
        const urlParams = new URLSearchParams(window.location.search);
        const proposalId = parseInt(urlParams.get("proposal"));

        if (!proposalId && window.location.pathname.includes('index.html')) {
            console.error("No proposal ID found - redirecting to dashboard, Please open this proposal from the dashboard first!");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
            return false;
        }

        return true;
    }

    checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
            window.location.href = "index.html";
            return false;
        }
        return true;
    }

    initializeComponents() {
        this.setupEventListeners();
        this.renderProposals();
        this.setupInvestmentItem();
        this.setupTimelineItem();
    }

    setupEventListeners() {
        const searchInput = document.querySelector(".search-bar input");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => this.handleSearch(e));
        }

        const openNewProposalModalBtn = document.querySelector("#openNewProposalModalBtn");
        if (openNewProposalModalBtn) {
            openNewProposalModalBtn.addEventListener("click", () => this.toggleModal());
        }

        const createProposalBtn = document.querySelector(".modal-footer .btn-primary");
        if (createProposalBtn) {
            createProposalBtn.addEventListener("click", () => this.handleCreateProposal());
        }

        const closeModalBtn = document.querySelector(".close-modal");
        if (closeModalBtn) {
            closeModalBtn.addEventListener("click", () => this.toggleModal());
        }

        window.proposalManager.addListener(() => this.renderProposals());
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll(".proposal-card:not(.new-card)");

        cards.forEach((card) => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const client = card.querySelector("p").textContent.toLowerCase();
            card.style.display =
                title.includes(searchTerm) || client.includes(searchTerm)
                    ? "flex"
                    : "none";
        });
    }

 loadProposals() {
    const savedProposals = localStorage.getItem("proposals");
    if (savedProposals) {
        try {
            const proposals = JSON.parse(savedProposals);
            console.log("Loaded proposals:", proposals); 
            return proposals;
        } catch (error) {
            console.error("Error parsing saved proposals:", error);
            // Instead of removing everything, log a warning and use default proposals
            console.warn("Using default proposals due to parsing error.  Check localStorage for corrupted data.");
            return this.getDefaultProposals(); // Use defaults if parsing fails
        }
    } else {
        const defaultProposals = this.getDefaultProposals();
        this.saveProposals(); // Save the default proposals
        return defaultProposals;
    }
}


    getFormData() {
        const titleInput = document.querySelector('input[name="title"]');
        const clientInput = document.querySelector('input[name="client"]');
        const amountInput = document.querySelector('input[name="amount"]');
        const dateInput = document.querySelector('input[name="date"]');
        const investmentItems = this.getInvestmentItems();
        const timelineItems = this.getTimelineItems();
        const maintenanceOption = document.querySelector('input[name="maintenance"]:checked');
        const maintenance = maintenanceOption ? maintenanceOption.value : null;
        const services = this.getServices();

        return {
            title: titleInput ? titleInput.value : '',
            client: clientInput ? clientInput.value : '',
            amount: amountInput ? parseFloat(amountInput.value) || 0 : 0,
            date: dateInput ? dateInput.value : '',
            status: "draft",
            clientLogo: this.generateAvatarUrl(clientInput ? clientInput.value : ''),
            investment: investmentItems || [],
            timeline: timelineItems || [],
            maintenance: maintenance,
            services: services || []
        };
    }

    getServices() {
        const services = [];
        const tags = document.querySelectorAll('.service-tags .tag');
        tags.forEach(tag => {
            const serviceName = tag.textContent.replace(/<[^>]*>?/gm, '').trim(); //remove html tags
            if (serviceName) services.push(serviceName);
        });
        return services;
    }


    getInvestmentItems() {
        const investmentItems = [];
        const items = document.querySelectorAll('.investment-item');
        items.forEach(item => {
            const componentInput = item.querySelector('input[name="component"]');
            const descriptionInput = item.querySelector('input[name="description"]');
            const investmentInput = item.querySelector('input[name="investment"]');

            if (componentInput && descriptionInput && investmentInput) {
                const component = componentInput.value;
                const description = descriptionInput.value;
                const investment = parseFloat(investmentInput.value) || 0;
                investmentItems.push({ component, description, investment });
            }
        });
        return investmentItems;
    }

    getTimelineItems() {
        const timelineItems = [];
        const items = document.querySelectorAll('.timeline-item');
        items.forEach(item => {
            const phaseInput = item.querySelector('input[name="phase"]');
            const durationInput = item.querySelector('input[name="duration"]');
            const detailsInput = item.querySelector('input[name="details"]');

            if (phaseInput && durationInput && detailsInput) {
                const phase = phaseInput.value;
                const duration = durationInput.value;
                const details = detailsInput.value;
                timelineItems.push({ phase, duration, details });
            }
        });
        return timelineItems;
    }


    validateFormData(data) {
        if (!data.title) {
            alert("Please fill in the proposal title");
            return false;
        }
        if (!data.client) {
            alert("Please fill in the client company name");
            return false;
        }
        if (!data.amount) {
            alert("Please fill in the project amount");
            return false;
        }
        if (!data.date) {
            alert("Please fill in the project date");
            return false;
        }
        return true;
    }


    generateAvatarUrl(clientName) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            clientName
        )}&background=6366f1&color=fff`;
    }

    clearForm() {
        const form = document.querySelector(".modal form");
        if (form) form.reset();
    }

    toggleModal() {
        const modal = document.querySelector(".modal");
        if (modal) {
            modal.classList.toggle("active");
            document.body.style.overflow = modal.classList.contains("active")
                ? "hidden"
                : "";
        }
    }

    renderProposals() {
        const proposals = window.proposalManager.getAllProposals();
        const proposalGrid = document.querySelector(".proposal-grid");

        if (!proposalGrid) return;

        proposalGrid.innerHTML = ""; // Clear existing proposals

        // Add the new proposal card
        const newCard = this.createNewProposalCard();
        proposalGrid.appendChild(newCard);

        // Append each proposal card
        proposals.forEach((proposal) => {
            const proposalCard = this.createProposalCard(proposal);
            proposalGrid.appendChild(proposalCard);
        });

        this.setupProposalCardListeners();
        this.checkIfSigned();
    }
    checkIfSigned() {
        const urlParams = new URLSearchParams(window.location.search);
        const proposalId = parseInt(urlParams.get("proposal"));
        const statusElement = document.getElementById("proposalStatus");

        if (!proposalId) return;

        const signatureData = localStorage.getItem(`isSigned-${proposalId}`);
        let isSigned = false;

        try {
            // Try to parse the JSON data
            const parsedData = signatureData ? JSON.parse(signatureData) : null;
            isSigned = parsedData && parsedData.signed === true;
        } catch (error) {
            // Handle the case where the old string format is still in localStorage
            isSigned = signatureData === "true";

            // Update to new format
            if (isSigned) {
                localStorage.setItem(`isSigned-${proposalId}`, JSON.stringify({
                    signed: true,
                    timestamp: new Date().toISOString()
                }));
            }
        }

        const proposalCard = document.querySelector(`.proposal-card[data-id="${proposalId}"]`);

        if (statusElement) {
            statusElement.textContent = isSigned ? "Proposal zzzSigned" : "Proposal Pending";
        }

        if (proposalCard) {
            const statusBadge = proposalCard.querySelector(".status-badge");
            if (isSigned) {
                proposalCard.classList.add("signed");
                statusBadge.textContent = "Signed";
                statusBadge.classList.remove("pending", "draft");
                statusBadge.classList.add("approved");
            } else {
                proposalCard.classList.remove("signed");
                statusBadge.textContent = "Pending";
                statusBadge.classList.remove("approved");
                statusBadge.classList.add("pending");
            }
        }
    }

    createProposalCard(proposal) {
    const card = document.createElement("div");
    card.classList.add("proposal-card");
    card.dataset.id = proposal.id;

    card.innerHTML = `
        <div class="card-header">
            <img src="${proposal.clientLogo}" alt="${proposal.client}">
            <div class="status-badge ${proposal.status}">${proposal.status}</div>
            <button class="delete-proposal-btn"><i class="ri-delete-bin-line"></i></button>
        </div>
        <div class="card-content">
            <h3>${proposal.title}</h3>
            <p>${proposal.client}</p>
            <div class="card-meta">
                <span><i class="ri-calendar-line"></i> ${proposal.date}</span>
                <span><i class="ri-money-dollar-circle-line"></i> $${proposal.amount.toLocaleString()}</span>
            </div>
            ${this.createInvestmentTable(proposal.investment)}
            ${this.createTimeline(proposal.timeline)}
            ${this.createMaintenanceSection(proposal.maintenance)}
        </div>
    `;

    return card;
}

createMaintenanceSection(maintenance) {
    if (!maintenance) return '';

    let maintenanceHTML = `
        <div class="maintenance-section">
            <h4>Maintenance & Support</h4>
            <p>${this.getMaintenanceDetails(maintenance)}</p>
        </div>
    `;

    return maintenanceHTML;
}

getMaintenanceDetails(maintenance) {
    const maintenanceDetails = {
        basic: `
            Basic <br>
            $250/month <br>
            $2,550/year (15% discount) <br>
            Security updates <br>
            Regular backups <br>
            Uptime monitoring <br>
            Email support
        `,
        standard: `
            Standard <br>
            $450/month <br>
            $4,590/year (15% discount) <br>
            All Basic features <br>
            Content updates (up to 5 pages/month) <br>
            Performance optimization <br>
            Priority support <br>
            Monthly analytics report
        `,
        premium: `
            Premium <br>
            $750/month <br>
            $7,650/year (15% discount) <br>
            All Standard features <br>
            Unlimited content updates <br>
            Advanced SEO optimization <br>
            24/7 emergency support <br>
            Quarterly strategy sessions <br>
            Social media integration
        `,
    };
    return maintenanceDetails[maintenance] || 'No maintenance selected';
}
    createNewProposalCard() {
        const card = document.createElement("div");
        card.classList.add("proposal-card", "new-card");
        card.id = "newProposalCard";

        card.innerHTML = `
            <div class="card-content">
                <i class="ri-add-circle-line"></i>
                <h3>Create New Proposal</h3>
                <p>Start from scratch or use a template</p>
            </div>
        `;

        return card;
    }

    setupProposalCardListeners() {
        // Regular proposal cards
        document
            .querySelectorAll(".proposal-card:not(.new-card)")
            .forEach((card) => {
                card.addEventListener("click", () => this.handleProposalClick(card));
                this.setupCardHoverEffects(card);
            });

        // New proposal card
        const newCard = document.querySelector("#newProposalCard");
        if (newCard) {
            newCard.addEventListener("click", () => this.toggleModal());
        }
        this.setupDeleteButtonListeners();
    }

    handleProposalClick(card) {
        const id = parseInt(card.dataset.id);
        const proposalWindow = window.open(`index.html?proposal=${id}`, '_blank',
            'width=800,height=600');
    }

    setupDeleteButtonListeners() {
        document.querySelectorAll(".delete-proposal-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent card click event from firing
                const card = button.closest(".proposal-card");
                const proposalId = parseInt(card.dataset.id);
                this.handleDeleteProposal(proposalId);
            });
        });
    }

    handleDeleteProposal(proposalId) {
        if (confirm("Are you sure you want to delete this proposal?")) {
            window.proposalManager.deleteProposal(proposalId);
            localStorage.removeItem(`isSigned-${proposalId}`); // Remove signature data
            this.renderProposals();
            console.log(`Proposal ${proposalId} deleted`);
        }
    }

    setupCardHoverEffects(card) {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-4px)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
        });
    }

    setupInvestmentItem() {
        const addInvestmentItemBtn = document.getElementById('add-investment-item');
        const investmentItemsContainer = document.getElementById('investment-items');

        if (addInvestmentItemBtn) {
            addInvestmentItemBtn.addEventListener('click', () => {
                const newItem = document.createElement('div');
                newItem.classList.add('investment-item');
                newItem.innerHTML = `
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" name="component" placeholder="Component" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="description" placeholder="Description" required>
                        </div>
                        <div class="form-group">
                            <input type="number" name="investment" placeholder="Investment" required>
                        </div>
                    </div>
                `;
                investmentItemsContainer.appendChild(newItem);
            });
        }
    }

      createInvestmentTable(investmentData) {
        if (!Array.isArray(investmentData) || investmentData.length === 0) return '';

        let tableHTML = `
            <table class="investment-table">
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Description</th>
                        <th>Investment</th>
                    </tr>
                </thead>
                <tbody>
        `;

        investmentData.forEach(item => {
            tableHTML += `
                <tr>
                    <td>${item.component}</td>
                    <td>${item.description}</td>
                    <td>$${item.investment.toLocaleString()}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        return tableHTML;
    }


       createTimeline(timelineData) {
        if (!Array.isArray(timelineData) || timelineData.length === 0) return '';

        let timelineHTML = '<div class="timeline">';

        timelineData.forEach(item => {
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-phase">${item.phase}</div>
                    <div class="timeline-duration">${item.duration}</div>
                    <div class="timeline-details">${item.details}</div>
                </div>
            `;
        });

        timelineHTML += '</div>';
        return timelineHTML;
    }


    setupTimelineItem() {
        const addTimelineItemBtn = document.getElementById('add-timeline-item');
        const timelineItemsContainer = document.getElementById('timeline-items');

        if (addTimelineItemBtn) {
            addTimelineItemBtn.addEventListener('click', () => {
                const newItem = document.createElement('div');
                newItem.classList.add('timeline-item');
                newItem.innerHTML = `
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" name="phase" placeholder="Phase" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="duration" placeholder="Duration" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="details" placeholder="Details" required>
                        </div>
                    </div>
                `;
                timelineItemsContainer.appendChild(newItem);
            });
        }
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        window.dashboard = new Dashboard();
    });
} else {
    window.dashboard = new Dashboard();
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
    serviceInput.value = "";
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
