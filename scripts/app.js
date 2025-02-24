/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: app.js
    Date: February 23, 2025
*/

"use strict";

// IIFE - Wraps the entire code to avoid global namespace pollution
(function() {
    // List of volunteer opportunities for the opportunities page
    const opportunities = [
        { title: "Community Clean-Up",
        description: "Join us for a community clean-up day to help keep our city beautiful!",
        date: "February 2, 2025",
        time: "08:00 AM - 2:00 PM" },

        { title: "Food Bank Help",
        description: "Help organize donations and prepare food packages for distribution!",
        date: "February 8, 2025",
        time: "9:00 AM - 1:00 PM" },

        { title: "Clothes Donations",
        description: "Spend time with the elderly and help hand packages of clothes to anyone in need!",
        date: "February 15, 2025",
        time: "1:00 PM - 4:00 PM" }
    ];

    // Starts the app by initializing key functions
    function Start() {
        console.log("App starting...");
        setActiveLink();
        DisplayHomePage();
        DisplayContactListPage();
        loadMemes();

        // Checks for specific page elements and runs related functions
        if (document.getElementById('opportunitiesContainer')) {
            populateOpportunities();
        }
        if (document.getElementById('eventsCalendar')) {
            InitializeCalendar();
        }
        if (document.getElementById('contactForm')) {
            setupContactForm();
        }
    }

    // Highlights the active navigation link based on the current URL
    function setActiveLink() {
        // Gets all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        // Gets current page path
        const currentPath = window.location.pathname.split("/").pop();

        // Loops through each link to check and update active status
        navLinks.forEach(link => {
            // Checks if link matches current page
            if (link.getAttribute('href') === currentPath) {
                // Marks link as active
                link.classList.add('active');
                // Adds accessibility attribute
                link.setAttribute('aria-current', 'page');
            } else {
                // Removes active class from other links
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // Adds features to the home page, like a button click and paragraph
    function DisplayHomePage() {
        // Gets the About Us button
        const AboutUsButton = document.getElementById("AboutUsBtn");
        if (AboutUsButton) {
            // Adds click listener to button
            AboutUsButton.addEventListener("click", () => {
                // Redirects to about page
                location.href = "about.html";
            });

            // Gets the main content area
            const MainContent = document.getElementsByTagName("main")[0];
            const MainParagraph = document.createElement("p");
            // Text for the paragraph
            const firstString = "This is";
            MainParagraph.setAttribute("id", "MainParagraph");
            MainParagraph.setAttribute("class", "mt-3");
            MainParagraph.textContent = `${firstString} the Main Paragraph!`;
            MainContent.appendChild(MainParagraph);
        }
    }

    // Fetches and displays a random meme from the Meme API on the home page
    function loadMemes() {
        // Fetches memes from the API
        fetch('https://api.mememaker.net/v1/memes')
            .then(response => response.json()) 
            .then(data => {
                // Gets the meme display area
                const memeDisplay = document.getElementById('memeDisplay');
                // Checks if data exists
                if (data && data.length > 0) {
                    // Picks a random meme
                    const randomMeme = data[Math.floor(Math.random() * data.length)];
                    // Displays the meme image
                    memeDisplay.innerHTML = `<img src="${randomMeme.imageUrl}" alt="Community Meme">`;
                } else {
                    // Shows error if no memes
                    memeDisplay.innerHTML = '<p>No memes available at the moment.</p>';
                }
            })
            .catch(error => {
                // Logs any fetch errors
                console.error('Error loading memes:', error);
                // Gets the meme display area
                const memeDisplay = document.getElementById('memeDisplay');
                memeDisplay.innerHTML = '<p>Failed to load memes. Please try again later.</p>';
            });
    }

    // Displays contact information from localStorage on the contact list page
    function DisplayContactListPage() {
        console.log("Contact List Page");
        // Checks if contacts exist and element is present
        if (localStorage.length > 0 && document.getElementById("contactList")) {
            // Gets the contact list table
            const contactList = document.getElementById("contactList");
            let data = "";
            // Gets all localStorage keys
            const keys = Object.keys(localStorage);
            let index = 1;

            // Loops through each contact in localStorage
            for (const key of keys) {
                // Gets contact data
                const contactData = localStorage.getItem(key);
                const contact = new Contact();
                contact.deserialize(contactData);
                data += `<tr>
                    <th scope="row" class="text-center">${index}</th> <!-- Row number -->
                    <td>${contact.FullName}</td> <!-- Full name -->
                    <td>${contact.ContactNumber}</td> <!-- Contact number -->
                    <td>${contact.EmailAddress}</td> <!-- Email address -->
                    <td><button class="btn btn-danger btn-sm" onclick="deleteContact('${key}')">Delete</button></td> <!-- Delete button -->
                    <td><button class="btn btn-warning btn-sm" onclick="editContact('${key}')">Edit</button></td> <!-- Edit button -->
                </tr>`;
                index++;
            }
            // Updates the table with contact data
            contactList.innerHTML = data;
        }
    }

    // Adds opportunity cards to the opportunities page
    function populateOpportunities() {
        // Gets the opportunities container
        const container = document.getElementById('opportunitiesContainer');
        // Loops through each opportunity
        opportunities.forEach(opportunity => {
            // Creates HTML for an opportunity card
            const cardHtml = `
                <div class="col-md-4 mb-3">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${opportunity.title}</h5> <!-- Opportunity title -->
                            <p class="card-text">${opportunity.description}</p> <!-- Opportunity description -->
                            <p class="card-text"><small class="text-muted">${opportunity.date} at ${opportunity.time}</small></p> <!-- Date and time -->
                            <button class="btn btn-primary" onclick="openModal('${opportunity.title}')">Sign Up</button> <!-- Sign-up button -->
                        </div>
                    </div>
                </div>
            `;
            // Adds each opportunity as a card
            container.innerHTML += cardHtml;
        });
    }

    // Shows a modal for signing up to a specific opportunity
    function openModal(title) {
        // Gets the modal title element
        const modalTitle = document.getElementById('modalTitle');
        // Sets the modal title
        modalTitle.innerText = `Sign Up for ${title}`;
        $('#signUpModal').modal('show');
    }

    // Handles submission for the opportunities sign-up form
    if (document.getElementById('signUpForm')) {
        // Adds submit listener to the sign-up form
        document.getElementById('signUpForm').addEventListener('submit', function(event) {
            // Prevents default form submission
            event.preventDefault();
            const email = document.getElementById('emailAddress').value;
            // Validates email format
            if (email.includes('@')) {
                console.log('Form is valid');
                $('#signUpModal').modal('hide');
                alert('Thank you for signing up!');
            } else {
                // Shows error for invalid email
                alert('Error! Please enter a valid email address...');
            }
        });
    }

    // Sets up the contact form to save data to localStorage
    function setupContactForm() {
        // Gets the contact form
        const form = document.getElementById('contactForm');
        if (form) {
            // Adds submit listener to the contact form
            form.addEventListener('submit', function(event) {
                // Prevents default form submission
                event.preventDefault();
                const fullName = document.getElementById('fullName').value;
                const contactNumber = document.getElementById('contactNumber').value;
                const emailAddress = document.getElementById('emailAddress').value;
                const message = document.getElementById('message').value || '';

                // Creates a new Contact object
                const contact = new Contact();
                contact.FullName = fullName;
                contact.ContactNumber = contactNumber;
                contact.EmailAddress = emailAddress;

                // Serializes contact data
                const serializedData = contact.serialize();
                if (serializedData) {
                    // Creates a unique key with timestamp
                    const key = `contact_${Date.now()}`;
                    // Saves to localStorage
                    localStorage.setItem(key, serializedData);
                    alert('Contact submitted successfully!');n
                    form.reset();
                } else {
                    // Shows error for invalid data
                    alert('Error submitting contact! Please check your input for the fields...');
                }
            });

            // Adds click listener to reset the contact form
            document.getElementById('cancelButton').addEventListener('click', function() {
                form.reset();
            });
        }
    }

    // Deletes a contact from localStorage and updates the display
    window.deleteContact = function(key) {
        // Confirms deletion with the user
        if (confirm('Are you sure you want to delete this contact?')) {
            // Removes contact from localStorage
            localStorage.removeItem(key);
            DisplayContactListPage();
        }
    };

    // Loads contact data for editing in the contact form
    window.editContact = function(key) {
        // Gets contact data from localStorage
        const contactData = localStorage.getItem(key);
        // Checks if data exists
        if (contactData) {
            // Creates a new Contact object
            const contact = new Contact();
            // Loads data into the object
            contact.deserialize(contactData);
            document.getElementById('fullName').value = contact.FullName;
            document.getElementById('contactNumber').value = contact.ContactNumber;
            document.getElementById('emailAddress').value = contact.EmailAddress;
            localStorage.removeItem(key);
            // Informs user to update
            alert('Edit the form and submit to update this contact...');
        }
    };

    // Sets up and displays the events calendar on the events page
    function InitializeCalendar() {
        // Gets the calendar element and creates/configures the full calendar
        const calendarEl = document.getElementById('eventsCalendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            // List of events for the calendar
            events: [
                { title: 'Fundraiser Event', start: '2025-02-05', category: 'Fundraisers' },
                { title: 'Workshop on Development', start: '2025-02-10', category: 'Donations' },
                { title: 'Neighborhood Cleanup', start: '2025-02-15', category: 'Cleanups' }
            ]
        });
        calendar.render();

        // Filters events based on category selection
        window.filterEvents = function(category, button) {
            // Filters events by category
            const filteredEvents = calendar.getEvents().filter(event => 
                category === 'all' ? true : event.extendedProps.category === category
            );
            // Clears current events and add filtered events
            calendar.removeAllEvents();
            calendar.addEventSource(filteredEvents);
            document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        };
    }

    // Manages contact data with properties for name, number, and email
    function Contact() {
        this.FullName = "";
        this.ContactNumber = "";
        this.EmailAddress = "";
    }

    Contact.prototype.serialize = function() {
        // Checks if all fields are filled
        if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
            // Returns formatted string
            return `${this.FullName}, ${this.ContactNumber}, ${this.EmailAddress}`;
        } else {
            // Logs error for missing fields
            console.error("Error! Missing fields that are required...");
            return null;
        }
    };

    Contact.prototype.deserialize = function(data) {
        // Splits and trims data into array
        const propertyArray = data.split(",").map(prop => prop.trim());
        // Checks if data has correct format
        if (propertyArray.length === 3) {
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        } else {
            // Logs error for invalid format
            console.error("Error! Data is not properly formatted...");
        }
    };

    // Runs Start when the page loads
    window.addEventListener("load", Start);
})();