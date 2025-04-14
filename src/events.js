/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: events.ts
    Date: March 22, 2025
*/
import { isLoggedIn, getCurrentUserName } from './auth.js';
class EventManager {
    constructor() {
        this.events = [];
        this.storageKey = 'harmonyHubEvents';
        this.viewMode = 'grid';
        // Load events first
        this.loadEvents();
        // Then setup event listeners
        this.setupEventListeners();
        // Finally display events
        this.displayEvents();
    }
    setupEventListeners() {
        // Form submission
        const eventForm = document.getElementById('eventForm');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => this.handleEventSubmission(e));
        }
        // View toggle buttons
        const listViewBtn = document.getElementById('viewToggleList');
        const gridViewBtn = document.getElementById('viewToggleGrid');
        if (listViewBtn && gridViewBtn) {
            listViewBtn.addEventListener('click', () => this.setViewMode('list'));
            gridViewBtn.addEventListener('click', () => this.setViewMode('grid'));
        }
        // Event delegation for join/delete buttons
        const eventsContainer = document.getElementById('eventsContainer');
        if (eventsContainer) {
            eventsContainer.addEventListener('click', (e) => {
                const target = e.target;
                const eventItem = target.closest('.event-item');
                if (!eventItem)
                    return;
                const eventId = eventItem.getAttribute('data-event-id');
                if (!eventId)
                    return;
                if (target.closest('.join-event-btn')) {
                    this.joinEvent(eventId);
                }
                else if (target.closest('.delete-event-btn')) {
                    this.deleteEvent(eventId);
                }
            });
        }
    }
    validateForm(form) {
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return false;
        }
        return true;
    }
    handleEventSubmission(e) {
        e.preventDefault();
        if (!isLoggedIn()) {
            alert('Please log in to create events.');
            return;
        }
        const form = e.target;
        if (!this.validateForm(form))
            return;
        const newEvent = {
            id: crypto.randomUUID(),
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            createdBy: getCurrentUserName() || 'Anonymous',
            participants: []
        };
        this.addEvent(newEvent);
        form.reset();
        form.classList.remove('was-validated');
    }
    addEvent(event) {
        this.events.push(event);
        this.saveEvents();
        this.displayEvents();
    }
    joinEvent(eventId) {
        if (!isLoggedIn()) {
            alert('Please log in to join events.');
            return;
        }
        const currentUser = getCurrentUserName();
        if (!currentUser)
            return;
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            if (event.participants.includes(currentUser)) {
                event.participants = event.participants.filter(p => p !== currentUser);
            }
            else {
                event.participants.push(currentUser);
            }
            this.saveEvents();
            this.displayEvents();
        }
    }
    deleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event)
            return;
        if (event.createdBy !== getCurrentUserName()) {
            alert('You can only delete events you created.');
            return;
        }
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(e => e.id !== eventId);
            this.saveEvents();
            this.displayEvents();
        }
    }
    setViewMode(mode) {
        this.viewMode = mode;
        const container = document.getElementById('eventsContainer');
        if (container) {
            container.className = `row ${mode === 'list' ? 'list-view' : 'grid-view'}`;
        }
        this.displayEvents();
    }
    loadEvents() {
        console.log("Loading events from localStorage");
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.events = JSON.parse(stored);
                console.log(`Loaded ${this.events.length} events`);
            }
            catch (error) {
                console.error('Error loading events:', error);
                this.events = [];
            }
        }
        else {
            console.log("No events found in localStorage");
            this.events = [];
        }
    }
    saveEvents() {
        console.log(`Saving ${this.events.length} events to localStorage`);
        localStorage.setItem(this.storageKey, JSON.stringify(this.events));
    }
    displayEvents() {
        console.log("Displaying events");
        const container = document.getElementById('eventsContainer');
        if (!container) {
            console.error("Events container not found");
            return;
        }
        // Clear the container first
        container.innerHTML = '';
        if (this.events.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center" id="noEventsMessage">
                    <p class="text-muted mt-3">No events planned yet. ${isLoggedIn() ? 'Be the first to create one!' : ''}</p>
                </div>`;
            return;
        }
        // Sort events by date
        const sortedEvents = [...this.events].sort((a, b) => new Date(a.date + 'T' + a.time).getTime() -
            new Date(b.date + 'T' + b.time).getTime());
        const template = document.getElementById('eventTemplate');
        if (!template) {
            console.error("Event template not found");
            return;
        }
        console.log(`Displaying ${sortedEvents.length} events`);
        sortedEvents.forEach(event => {
            const clone = template.content.cloneNode(true);
            const eventElement = clone.querySelector('.event-item');
            if (eventElement) {
                eventElement.setAttribute('data-event-id', event.id);
                const nameElement = clone.querySelector('.event-name');
                const dateElement = clone.querySelector('.event-date');
                const timeElement = clone.querySelector('.event-time');
                const locationElement = clone.querySelector('.event-location');
                const descriptionElement = clone.querySelector('.event-description');
                const joinButton = clone.querySelector('.join-event-btn');
                const deleteButton = clone.querySelector('.delete-event-btn');
                const cardFooter = clone.querySelector('.card-footer');
                if (nameElement)
                    nameElement.textContent = event.name;
                if (dateElement)
                    dateElement.textContent = new Date(event.date).toLocaleDateString();
                if (timeElement)
                    timeElement.textContent = event.time;
                if (locationElement)
                    locationElement.textContent = event.location;
                if (descriptionElement)
                    descriptionElement.textContent = event.description;
                // Only show action buttons for logged-in users
                if (!isLoggedIn() && cardFooter) {
                    cardFooter.remove();
                }
                else {
                    if (joinButton) {
                        const currentUser = getCurrentUserName();
                        if (currentUser && event.participants.includes(currentUser)) {
                            joinButton.textContent = 'Leave Event';
                            joinButton.classList.remove('btn-outline-primary');
                            joinButton.classList.add('btn-outline-secondary');
                        }
                    }
                    // Show delete button only for event creator
                    if (deleteButton && event.createdBy !== getCurrentUserName()) {
                        deleteButton.remove();
                    }
                }
                container.appendChild(clone);
            }
        });
    }
}
// Initialize events management when the page loads
export function initializeEventsPage() {
    const container = document.querySelector('.container');
    if (!container)
        return;
    // Common template HTML that needs to be present for both logged-in and non-logged-in users
    const commonTemplates = `
        <!-- Event Template -->
        <template id="eventTemplate">
            <div class="col-12 col-md-6 mb-4 event-item">
                <div class="card h-100 shadow-sm hover-card">
                    <div class="card-body">
                        <h5 class="card-title event-name"></h5>
                        <div class="event-details">
                            <p class="mb-2">
                                <i class="fas fa-calendar text-primary me-2"></i>
                                <span class="event-date"></span>
                            </p>
                            <p class="mb-2">
                                <i class="fas fa-clock text-primary me-2"></i>
                                <span class="event-time"></span>
                            </p>
                            <p class="mb-2">
                                <i class="fas fa-map-marker-alt text-primary me-2"></i>
                                <span class="event-location"></span>
                            </p>
                            <p class="mb-0 event-description"></p>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-sm btn-outline-primary join-event-btn">
                            <i class="fas fa-user-plus me-2"></i>Join Event
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-2 delete-event-btn">
                            <i class="fas fa-trash-alt me-2"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <!-- Loading Spinner Template -->
        <template id="loadingSpinner">
            <div class="text-center my-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </template>
    `;
    // If user is not logged in, show only the events list
    if (!isLoggedIn()) {
        container.innerHTML = `
            <div class="container mt-5">
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h3 class="mb-0"><i class="fas fa-calendar-alt me-2"></i>Upcoming Events</h3>
                                <div class="btn-group">
                                    <button class="btn btn-light btn-sm" id="viewToggleList">
                                        <i class="fas fa-list"></i>
                                    </button>
                                    <button class="btn btn-light btn-sm" id="viewToggleGrid">
                                        <i class="fas fa-th"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="alert alert-info text-center">
                                    <i class="fas fa-info-circle me-2"></i>Please log in to create and join events.
                                </div>
                                <div class="row" id="eventsContainer">
                                    <!-- Events will be dynamically inserted here -->
                                    <div class="col-12 text-center" id="noEventsMessage">
                                        <p class="text-muted mt-3">No events planned yet.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${commonTemplates}
        `;
    }
    else {
        // Show full interface with create event form for logged-in users
        container.innerHTML = `
            <div class="container mt-5">
                <div class="row">
                    <!-- Event Creation Form -->
                    <div class="col-lg-4 mb-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white">
                                <h3 class="mb-0"><i class="fas fa-calendar-plus me-2"></i>Create New Event</h3>
                            </div>
                            <div class="card-body">
                                <form id="eventForm" class="needs-validation" novalidate>
                                    <div class="mb-3">
                                        <label for="eventName" class="form-label">Event Name</label>
                                        <input type="text" class="form-control" id="eventName" required 
                                               minlength="3" maxlength="50">
                                        <div class="invalid-feedback">
                                            Please provide an event name (3-50 characters).
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="eventDate" class="form-label">Date</label>
                                        <input type="date" class="form-control" id="eventDate" required>
                                        <div class="invalid-feedback">
                                            Please select a valid date.
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="eventTime" class="form-label">Time</label>
                                        <input type="time" class="form-control" id="eventTime" required>
                                        <div class="invalid-feedback">
                                            Please select a valid time.
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="eventLocation" class="form-label">Location</label>
                                        <input type="text" class="form-control" id="eventLocation" required
                                               minlength="5" maxlength="100">
                                        <div class="invalid-feedback">
                                            Please provide a valid location (5-100 characters).
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="eventDescription" class="form-label">Description</label>
                                        <textarea class="form-control" id="eventDescription" rows="3" required
                                                  minlength="10" maxlength="500"></textarea>
                                        <div class="invalid-feedback">
                                            Please provide a description (10-500 characters).
                                        </div>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="fas fa-plus-circle me-2"></i>Create Event
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Events List -->
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                <h3 class="mb-0"><i class="fas fa-calendar-alt me-2"></i>Upcoming Events</h3>
                                <div class="btn-group">
                                    <button class="btn btn-light btn-sm" id="viewToggleList">
                                        <i class="fas fa-list"></i>
                                    </button>
                                    <button class="btn btn-light btn-sm" id="viewToggleGrid">
                                        <i class="fas fa-th"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row" id="eventsContainer">
                                    <!-- Events will be dynamically inserted here -->
                                    <div class="col-12 text-center" id="noEventsMessage">
                                        <p class="text-muted mt-3">No events planned yet. Be the first to create one!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${commonTemplates}
        `;
    }
    new EventManager();
}
