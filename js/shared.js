// Shared data management for proposals
class ProposalManager {
    constructor() {
        this.listeners = [];
        this.proposals = this.loadProposals();
        this.nextId = this.proposals.length > 0 ? Math.max(...this.proposals.map(p => p.id)) + 1 : 1;
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach((callback) => callback(this.proposals));
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
            console.log("No saved proposals found. Using default proposals.");
            const defaultProposals = this.getDefaultProposals();
            this.saveProposals(); // Save the default proposals
            return defaultProposals;
        }
    }

    saveProposals() {
        console.log("Saving proposals:", this.proposals); // Debugging
        localStorage.setItem("proposals", JSON.stringify(this.proposals));
        this.notifyListeners();
    }

    getDefaultProposals() {
        return [
            {
                id: 1,
                title: "Website Development Proposal",
                client: "Gaboil Energy",
                status: "pending",
                date: "Apr 6, 2025",
                amount: 16000,
                clientLogo:
                    "https://ui-avatars.com/api/?name=Gaboil+Energy&background=22c55e&color=fff",
                investment: [
                    { component: "Discovery", description: "Requirements gathering, sitemap creation", investment: 1500 },
                    { component: "Design", description: "Custom responsive design for all devices", investment: 3000 },
                    { component: "Development", description: "Front-end and back-end implementation", investment: 6500 },
                    { component: "Industry Features", description: "Industry-specific functionality", investment: 2500 },
                    { component: "SEO & Marketing", description: "Basic SEO setup and optimization", investment: 1200 },
                    { component: "Quality Assurance", description: "Testing and refinement", investment: 800 },
                    { component: "Training & Deployment", description: "Launch and knowledge transfer", investment: 500 }
                ],
                timeline: [
                    { phase: "Discovery", duration: "1-2 weeks", details: "Site architecture, content plan" },
                    { phase: "Design", duration: "3-4 weeks", details: "Mockups, UI/UX elements" },
                    { phase: "Development", duration: "5-6 weeks", details: "Functional website" },
                    { phase: "Testing", duration: "1-2 weeks", details: "Bug-free implementation" },
                    { phase: "Deployment", duration: "1 week", details: "Live website, training" }
                ],
                maintenance: "basic",
                services: ["Web Design", "Web Development", "SEO"]
            },
            {
                id: 2,
                title: "Mobile App Development",
                client: "Tech Corp",
                status: "approved",
                date: "Mar 15, 2025",
                amount: 25000,
                clientLogo:
                    "https://ui-avatars.com/api/?name=Tech+Corp&background=3b82f6&color=fff",
                investment: [
                    { component: "Planning", description: "Market research, feature definition", investment: 2000 },
                    { component: "Design", description: "UI/UX design, wireframing", investment: 4000 },
                    { component: "Development", description: "iOS and Android app development", investment: 15000 },
                    { component: "Testing", description: "QA testing, bug fixing", investment: 2500 },
                    { component: "Deployment", description: "App store submission", investment: 1500 }
                ],
                timeline: [
                    { phase: "Planning", duration: "2-3 weeks", details: "Market analysis, feature list" },
                    { phase: "Design", duration: "4-5 weeks", details: "Wireframes, mockups, UI/UX" },
                    { phase: "Development", duration: "8-10 weeks", details: "Coding, integration" },
                    { phase: "Testing", duration: "2-3 weeks", details: "QA, bug fixing" },
                    { phase: "Deployment", duration: "1-2 weeks", details: "App store submission" }
                ],
                maintenance: "standard",
                services: ["Mobile App Development", "UI/UX Design", "Testing"]
            },
            {
                id: 3,
                title: "IT Consulting Services",
                client: "Global Solutions",
                status: "draft",
                date: "Apr 1, 2025",
                amount: 12000,
                clientLogo:
                    "https://ui-avatars.com/api/?name=Global+Solutions&background=6366f1&color=fff",
                investment: [
                    { component: "Assessment", description: "Current IT infrastructure review", investment: 1000 },
                    { component: "Strategy", description: "IT strategy development", investment: 3000 },
                    { component: "Implementation", description: "IT solutions implementation", investment: 6000 },
                    { component: "Support", description: "Ongoing IT support", investment: 2000 }
                ],
                timeline: [
                    { phase: "Assessment", duration: "1-2 weeks", details: "Review of current systems" },
                    { phase: "Strategy", duration: "2-3 weeks", details: "IT roadmap development" },
                    { phase: "Implementation", duration: "4-6 weeks", details: "Deployment of new solutions" },
                    { phase: "Support", duration: "Ongoing", details: "Continuous maintenance and support" }
                ],
                maintenance: "premium",
                services: ["IT Consulting", "Cybersecurity", "Cloud Services"]
            },
        ];
    }

    addProposal(proposal) {
        proposal.id = this.nextId++;
        this.proposals.push(proposal);
        this.saveProposals();
        return proposal;
    }

    updateProposal(id, updatedProposal) {
        const index = this.proposals.findIndex((p) => p.id === id);
        if (index !== -1) {
            this.proposals[index] = { ...this.proposals[index], ...updatedProposal };
            this.saveProposals();
        }
    }

    updateProposalStatus(id, status) {
        this.updateProposal(id, { status });
    }

    deleteProposal(id) {
        this.proposals = this.proposals.filter((p) => p.id !== id);
        this.saveProposals();
    }

    getProposal(id) {
        return this.proposals.find((p) => p.id === id);
    }

    getAllProposals() {
        return this.proposals;
    }
}

// Create a global instance
window.proposalManager = new ProposalManager();
