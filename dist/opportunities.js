"use strict";
import { isLoggedIn, getCurrentUserName } from './auth.js';
export class OpportunityManager {
    constructor() {
        this.opportunities = [
            {
                id: '1',
                title: "Community Clean-up",
                description: "Join us for a community clean-up day to help keep our city beautiful!",
                date: "February 2, 2025",
                time: "08:00 AM - 2:00 PM",
                location: "Central Park",
                volunteers: []
            },
            {
                id: '2',
                title: "Food Bank Help",
                description: "Help organize donations and prepare food packages for distribution!",
                date: "February 8, 2025",
                time: "9:00 AM - 1:00 PM",
                location: "Community Food Bank",
                volunteers: []
            },
            {
                id: '3',
                title: "Clothes Donations",
                description: "Spend time with the elderly and help hand packages of clothes to anyone in need!",
                date: "February 15, 2025",
                time: "1:00 PM - 4:00 PM",
                location: "Senior Center",
                volunteers: []
            }
        ];
        this.storageKey = 'harmonyHubOpportunities';
        this.loadOpportunities();
        this.setupEventListeners();
        this.displayOpportunities();
        if (window.statistics) {
            window.statistics.trackPageVisit('/opportunities');
        }
    }
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('.volunteer-btn')) {
                e.preventDefault();
                console.log('Volunteer button clicked');
                this.handleVolunteerClick(target);
            }
        });
        const confirmButton = document.getElementById('confirmVolunteer');
        if (confirmButton) {
            confirmButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Confirm button clicked');
                this.handleVolunteerSubmit();
            });
        }
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = document.getElementById('volunteerModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('volunteerModal');
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    loadOpportunities() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                const storedOpps = JSON.parse(stored);
                if (storedOpps && storedOpps.length > 0) {
                    this.opportunities = storedOpps;
                }
                console.log('Loaded opportunities:', this.opportunities);
            }
            catch (error) {
                console.error('Error loading opportunities:', error);
            }
        }
        else {
            this.saveOpportunities();
        }
    }
    saveOpportunities() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.opportunities));
        console.log('Saved opportunities:', this.opportunities);
    }
    handleVolunteerClick(button) {
        if (!isLoggedIn()) {
            alert('Please log in to volunteer for opportunities');
            return;
        }
        const opportunityId = button.getAttribute('data-id');
        console.log('Handling volunteer click for opportunity:', opportunityId);
        if (!opportunityId) {
            console.error('No opportunity ID found');
            return;
        }
        const opportunity = this.opportunities.find(o => o.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found');
            return;
        }
        const username = getCurrentUserName();
        if (!username) {
            console.error('User not found');
            return;
        }
        if (opportunity.volunteers.includes(username)) {
            opportunity.volunteers = opportunity.volunteers.filter(v => v !== username);
            this.saveOpportunities();
            this.displayOpportunities();
            alert('You have been removed from this opportunity.');
            return;
        }
        const opportunityIdInput = document.getElementById('opportunityId');
        if (opportunityIdInput) {
            opportunityIdInput.value = opportunityId;
        }
        const modal = document.getElementById('volunteerModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    handleVolunteerSubmit() {
        console.log('Handling volunteer submit');
        const form = document.getElementById('volunteerForm');
        const opportunityId = document.getElementById('opportunityId').value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        if (!fullName || !email) {
            alert('Please fill in all fields');
            return;
        }
        const opportunity = this.opportunities.find(o => o.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found');
            return;
        }
        const username = getCurrentUserName();
        if (!username) {
            console.error('User not found');
            return;
        }
        if (!opportunity.volunteers.includes(username)) {
            opportunity.volunteers.push(username);
            this.saveOpportunities();
            if (window.statistics) {
                console.log('Tracking volunteer signup');
                window.statistics.trackVolunteerSignup({
                    fullName,
                    email,
                    opportunityId,
                    timestamp: new Date().toISOString()
                });
            }
            const modal = document.getElementById('volunteerModal');
            if (modal) {
                modal.style.display = 'none';
            }
            form.reset();
            this.displayOpportunities();
            alert('Thank you for volunteering!');
        }
    }
    displayOpportunities() {
        const container = document.getElementById('opportunitiesContainer');
        if (!container) {
            console.error('Opportunities container not found');
            return;
        }
        container.innerHTML = '';
        this.opportunities.forEach(opportunity => {
            const username = getCurrentUserName();
            const isVolunteer = username && opportunity.volunteers.includes(username);
            const cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 border-danger">
                        <div class="card-body d-flex flex-column">
                            <h3 class="card-title text-danger">${opportunity.title}</h3>
                            <p class="card-text">${opportunity.description}</p>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="fas fa-calendar"></i> ${opportunity.date}<br>
                                    <i class="fas fa-clock"></i> ${opportunity.time}<br>
                                    <i class="fas fa-map-marker-alt"></i> ${opportunity.location}
                                </small>
                            </p>
                            <p class="card-text mt-auto">
                                <small class="text-muted">
                                    <i class="fas fa-users"></i> ${opportunity.volunteers.length} volunteer${opportunity.volunteers.length !== 1 ? 's' : ''} registered
                                </small>
                            </p>
                            ${isLoggedIn() ? `
                                <button class="btn ${isVolunteer ? 'btn-danger' : 'btn-outline-danger'} volunteer-btn w-100" 
                                        data-id="${opportunity.id}">
                                    ${isVolunteer ? 'Leave Opportunity' : 'Volunteer Now'}
                                </button>
                            ` : `
                                <button class="btn btn-outline-secondary w-100" onclick="alert('Please log in to volunteer')">
                                    Login to Volunteer
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });
    }
}
export function DisplayOpportunitiesPage() {
    const container = document.getElementById('opportunitiesContainer');
    if (!container) {
        console.error('Opportunities container not found');
        return;
    }
    new OpportunityManager();
}
//# sourceMappingURL=opportunities.js.map