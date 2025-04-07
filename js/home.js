// c:\Users\pinto\Documents\Development\PisvalTech_\js\home.js
class Home {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        console.log("Initializing application...");
        this.setupModalHandlers();
        this.setupAnimations();
        this.setupSmoothScrolling();
        this.setupHoverEffects();
        this.setupSignHereLink();
        this.setupMessageListener();
        this.renderAllProposals();
        this.verifyProposalContext();
        this.setupDashboardButton();
        this.setupProposalCardListeners();
    }

    setupDashboardButton() {
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                window.open('dashboard.html', '_blank');
            });
        }
    }

    
setupMessageListener() {
    window.addEventListener('message', (event) => {
        console.log("Received message:", event.data);
        if (event.data.type === 'proposalCreated') {
            const { proposal } = event.data;
            this.updateProposal(proposal);
            this.renderAllProposals();
        } else if (event.data.type === 'proposalSigned') {
            const { proposalId } = event.data;
            this.handleProposalSigned(proposalId);
        }
    });
}

    handleProposalSigned(proposalId) {
        console.log(`Proposal ${proposalId} has been signed.`);
        // Update the UI to reflect that the proposal has been signed
        const proposalCard = document.querySelector(`.proposal-card[data-id="${proposalId}"]`);
        if (proposalCard) {
            const statusBadge = proposalCard.querySelector(".status-badge");
            if (statusBadge) {
                statusBadge.textContent = "Signed";
                statusBadge.classList.remove("pending", "draft");
                statusBadge.classList.add("approved");
            }
        }
    }
updateProposal(proposal) {
    console.log("updateProposal called with:", proposal);
    if (!window.proposalManager) {
        console.error("proposalManager is not defined.");
        return;
    }
    window.proposalManager.addProposal(proposal); // Add the new proposal
    this.renderAllProposals();
}


    renderAllProposals() {
        console.log("renderAllProposals called");
        if (!window.proposalManager) {
            console.error("proposalManager is not defined.");
            return;
        }
        const proposals = window.proposalManager.getAllProposals();
        console.log("Proposals to render:", proposals);
        const proposalsContainer = document.getElementById("proposals-container");
        if (!proposalsContainer) {
            console.error("proposals-container not found.");
            return;
        }

        proposalsContainer.innerHTML = "";

        proposals.forEach((proposal) => {
            const proposalCard = this.createProposalCard(proposal);
            proposalsContainer.appendChild(proposalCard);
        });
        this.setupProposalCardListeners();
    }

    createProposalCard(proposal) {
        const card = document.createElement("div");
        card.classList.add("proposal-card");
        card.dataset.id = proposal.id;

        // Check if the proposal is signed
        const isSigned = localStorage.getItem(`isSigned-${proposal.id}`);
        if (isSigned) {
            card.classList.add("signed");
        }

        card.innerHTML = `
            <div class="card-header">
                <img src="${proposal.clientLogo}" alt="${proposal.client}">
                <div class="status-badge ${proposal.status}">${proposal.status}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${proposal.title}</h3>
                <p class="card-client">${proposal.client}</p>
                <div class="card-meta">
                    <span class="card-date"><i class="ri-calendar-line"></i> ${proposal.date}</span>
                    <span class="card-amount"><i class="ri-money-dollar-circle-line"></i> $${proposal.amount.toLocaleString()}</span>
                </div>
                <div class="card-details">
                    ${this.createInvestmentTable(proposal.investment)}
                    ${this.createTimeline(proposal.timeline)}
                    ${this.createMaintenanceSection(proposal.maintenance)}
                </div>
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

    verifyProposalContext() {
        const urlParams = new URLSearchParams(window.location.search);
        const proposalId = parseInt(urlParams.get("proposal"));

        if (proposalId) {
            const proposal = window.proposalManager.getProposal(proposalId);
            if (proposal) {
                this.renderProposalDetails(proposal);
            } else {
                console.error(`Proposal with ID ${proposalId} not found.`);
            }
        }
    }

    renderProposalDetails(proposal) {
        console.log("Rendering proposal details:", proposal);
        document.title = `Pisval Tech Proposal for ${proposal.client}`;

        const header = document.querySelector('header');
        if (header) {
            const h1 = header.querySelector('h1');
            const subtitle = header.querySelector('.subtitle');
            if (h1) h1.textContent = proposal.title;
            if (subtitle) subtitle.textContent = `Professional Web Solution for ${proposal.client}`;
        }

        const proposalInfo = document.querySelector('.proposal-info');
        if (proposalInfo) {
            const clientName = proposalInfo.querySelector('p:nth-child(2)');
            const date = proposalInfo.querySelector('p:nth-child(3)');
            if (clientName) clientName.textContent = proposal.client;
            if (date) date.textContent = proposal.date;
        }
        // Render the investment and timeline details
        const investmentSection = document.querySelector('#investment-section');
        if (investmentSection) {
            investmentSection.innerHTML = `<h2>INVESTMENT</h2>${this.createInvestmentTable(proposal.investment)}`;
        }

        const timelineSection = document.querySelector('#timeline-section');
        if (timelineSection) {
            timelineSection.innerHTML = `<h2>TIMELINE</h2>${this.createTimeline(proposal.timeline)}`;
        }
    }

    setupModalHandlers() {
        const modal = document.getElementById('authModal');
        const closeModalBtn = modal.querySelector('.close-modal');
        const loginForm = document.getElementById('loginForm');
        const errorMessage = modal.querySelector('.error-message');

        const openModal = () => {
            modal.classList.add('show');
        };

        const closeModal = () => {
            modal.classList.remove('show');
        };

        const handleLogin = (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === window.CONFIG.AUTH.email && password === window.CONFIG.AUTH.password) {
                sessionStorage.setItem('isAuthenticated', 'true');
                closeModal();
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = 'Invalid email or password.';
                errorMessage.classList.add('active');
            }
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        const dashboardBtn = document.getElementById('dashboardBtn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
                if (!isAuthenticated) {
                    openModal();
                } else {
                    window.location.href = 'dashboard.html';
                }
            });
        }
    }

    setupAnimations() {
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.classList.add('animate');
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupHoverEffects() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'scale(1.05)';
            });

            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'scale(1)';
            });
        }
    }

    setupSignHereLink() {
        const signHereLink = document.getElementById('signHere');
        if (signHereLink) {
            signHereLink.addEventListener('click', (event) => {
                event.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                const proposalId = parseInt(urlParams.get('proposal'));

                if (proposalId) {
                    const signatureData = {
                        signed: true,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem(`isSigned-${proposalId}`, JSON.stringify(signatureData));

                    // Notify the dashboard that the proposal has been signed
                    if (window.opener && !window.opener.closed) {
                        window.opener.postMessage({ type: 'proposalSigned', proposalId: proposalId }, '*');
                    } else {
                        console.warn("window.opener is not available or closed.");
                    }
                    this.handleProposalSigned(proposalId);
                } else {
                    console.error("No proposal ID found.");
                }
            });
        }
    }
    setupProposalCardListeners() {
        document.querySelectorAll(".proposal-card").forEach((card) => {
            card.addEventListener("click", () => this.handleProposalClick(card));
        });
    }

    handleProposalClick(card) {
        const id = parseInt(card.dataset.id);
        const proposalWindow = window.open(`index.html?proposal=${id}`, '_blank',
            'width=800,height=600');
    }
}

// Initialize Home when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        window.home = new Home();
    });
} else {
    window.home = new Home();
}
