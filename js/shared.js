// Shared data management for proposals
class ProposalManager {
  constructor() {
    this.proposals = this.loadProposals();
  }

  loadProposals() {
    const savedProposals = localStorage.getItem("proposals");
    if (savedProposals) {
      return JSON.parse(savedProposals);
    }

    // Default proposals if none exist
    const defaultProposals = [
      {
        id: 1,
        title: "Website Development Proposal",
        client: "Gaboil Energy",
        status: "pending",
        date: "Apr 6, 2025",
        amount: 16000,
        clientLogo:
          "https://ui-avatars.com/api/?name=Gaboil+Energy&background=22c55e&color=fff",
        services: [
          "Discovery & Planning",
          "Design",
          "Development",
          "Industry Features",
          "SEO & Marketing",
          "Quality Assurance",
          "Training & Deployment",
        ],
        timeline: {
          discovery: {
            duration: "1-2 weeks",
            details: "Site architecture, content plan",
          },
          design: { duration: "3-4 weeks", details: "Mockups, UI/UX elements" },
          development: { duration: "5-6 weeks", details: "Functional website" },
          testing: {
            duration: "1-2 weeks",
            details: "Bug-free implementation",
          },
          deployment: { duration: "1 week", details: "Live website, training" },
        },
        investment: {
          discovery: 1500,
          design: 3000,
          development: 6500,
          industryFeatures: 2500,
          seoMarketing: 1200,
          qualityAssurance: 800,
          trainingDeployment: 500,
        },
        paymentSchedule: {
          initial: 4800,
          design: 6400,
          completion: 4800,
        },
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
      },
    ];

    this.saveProposals(defaultProposals);
    return defaultProposals;
  }

  saveProposals(proposals) {
    localStorage.setItem("proposals", JSON.stringify(proposals));
    this.notifyListeners();
  }

  addProposal(proposal) {
    proposal.id = this.proposals.length + 1;
    this.proposals.push(proposal);
    this.saveProposals(this.proposals);
  }

  updateProposal(id, updatedProposal) {
    const index = this.proposals.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.proposals[index] = { ...this.proposals[index], ...updatedProposal };
      this.saveProposals(this.proposals);
    }
  }

  deleteProposal(id) {
    this.proposals = this.proposals.filter((p) => p.id !== id);
    this.saveProposals(this.proposals);
  }

  getProposal(id) {
    return this.proposals.find((p) => p.id === id);
  }

  getAllProposals() {
    return this.proposals;
  }

  // Event handling for updates
  listeners = [];

  addListener(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.proposals));
  }
}

// Create a global instance
window.proposalManager = new ProposalManager();
