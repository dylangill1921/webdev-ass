"use strict";

// IIFE - Immediately Invoked Functional Expression
(function() {
    // Opportunities array
    const opportunities = [
        {
            title: "Community Clean-Up",
            description: "Join us for a community clean-up day to help keep our city beautiful!",
            date: "February 2, 2025",
            time: "08:00 AM - 2:00 PM"
        },
        {
            title: "Food Bank Help",
            description: "Help organize donations and prepare food packages for distribution!",
            date: "February 8, 2025",
            time: "9:00 AM - 1:00 PM"
        },
        {
            title: "Clothes Donations",
            description: "Spend time with the elderly and help hand packages of clothes to anyone in need!",
            date: "February 15, 2025",
            time: "1:00 PM - 4:00 PM"
        }
    ];

    function Start() {
        console.log("App starting...");
        setActiveLink();
        DisplayHomePage();
        DisplayContactListPage();

        // Scope-specific page functionality
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

    // Set active link based on the current URL
    function setActiveLink() {
        var navLinks = document.querySelectorAll('.nav-link');
        var currentPath = window.location.pathname.split("/").pop();

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // Home page enhancements
    function DisplayHomePage() {
        let AboutUsButton = document.getElementById("AboutUsBtn");
        if (AboutUsButton) {
            AboutUsButton.addEventListener("click", function() {
                location.href = "about.html";
            });

            let MainContent = document.getElementsByTagName("main")[0];
            let MainParagraph = document.createElement("p");
            let firstString = "This is";
            MainParagraph.setAttribute("id", "MainParagraph");
            MainParagraph.setAttribute("class", "mt-3");
            MainParagraph.textContent = `${firstString} the Main Paragraph!`;
            MainContent.appendChild(MainParagraph);
        }
    }

    // Contact list display
    function DisplayContactListPage() {
        console.log("Contact List Page");
        if (localStorage.length > 0 && document.getElementById("contactList")) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;

            for (const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new Contact();
                contact.deserialize(contactData);
                data += `<tr>
                    <th scope="row" class="text-center">${index}</th>
                    <td>${contact.FullName}</td>
                    <td>${contact.ContactNumber}</td>
                    <td>${contact.EmailAddress}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteContact('${key}')">Delete</button></td>
                    <td><button class="btn btn-warning btn-sm" onclick="editContact('${key}')">Edit</button></td>
                </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
    }

    // Populate opportunities page with cards
    function populateOpportunities() {
        const container = document.getElementById('opportunitiesContainer');
        opportunities.forEach(opportunity => {
            const cardHtml = `
                <div class="col-md-4 mb-3">
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${opportunity.title}</h5>
                            <p class="card-text">${opportunity.description}</p>
                            <p class="card-text"><small class="text-muted">${opportunity.date} at ${opportunity.time}</small></p>
                            <button class="btn btn-primary" onclick="openModal('${opportunity.title}')">Sign Up</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });
    }

    // Modal handling for opportunities
    function openModal(title) {
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.innerText = `Sign Up for ${title}`;
        $('#signUpModal').modal('show');
    }

    // Form submission for sign-up
    if (document.getElementById('signUpForm')) {
        document.getElementById('signUpForm').addEventListener('submit', function(event) {
            event.preventDefault();
            let email = document.getElementById('emailAddress').value;
            if (email.includes('@')) {
                console.log('Form is valid');
                $('#signUpModal').modal('hide');
                alert('Thank you for signing up!');
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Setup contact form submission
    function setupContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const fullName = document.getElementById('fullName').value;
                const contactNumber = document.getElementById('contactNumber').value;
                const emailAddress = document.getElementById('emailAddress').value;
                const message = document.getElementById('message').value || ''; // Optional message

                const contact = new Contact();
                contact.FullName = fullName;
                contact.ContactNumber = contactNumber;
                contact.EmailAddress = emailAddress;

                const serializedData = contact.serialize();
                if (serializedData) {
                    const key = `contact_${Date.now()}`; // Unique key using timestamp
                    localStorage.setItem(key, serializedData);
                    alert('Contact submitted successfully!');
                    form.reset(); // Clear the form
                } else {
                    alert('Error submitting contact. Please check your input.');
                }
            });

            // Cancel button reset
            document.getElementById('cancelButton').addEventListener('click', function() {
                form.reset();
            });
        }
    }

    // Delete contact function
    window.deleteContact = function(key) {
        if (confirm('Are you sure you want to delete this contact?')) {
            localStorage.removeItem(key);
            DisplayContactListPage(); // Refresh the contact list
        }
    };

    // Edit contact function (basic implementation)
    window.editContact = function(key) {
        const contactData = localStorage.getItem(key);
        if (contactData) {
            const contact = new Contact();
            contact.deserialize(contactData);
            document.getElementById('fullName').value = contact.FullName;
            document.getElementById('contactNumber').value = contact.ContactNumber;
            document.getElementById('emailAddress').value = contact.EmailAddress;
            localStorage.removeItem(key); // Remove old data for update
            // You could navigate back to contact.html or handle editing in a modal
            alert('Edit the form and submit to update this contact.');
        }
    };

    // Initialize FullCalendar on events page
    function InitializeCalendar() {
        var calendarEl = document.getElementById('eventsCalendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: [
                { title: 'Fundraiser Event', start: '2025-02-05', category: 'Fundraisers' },
                { title: 'Workshop on Development', start: '2025-02-10', category: 'Donations' },
                { title: 'Neighborhood Cleanup', start: '2025-02-15', category: 'Cleanups' }
            ]
        });
        calendar.render();

        // Filter events
        window.filterEvents = function(category, button) {
            var filteredEvents = calendar.getEvents().filter(event => 
                category === 'all' ? true : event.extendedProps.category === category
            );
            calendar.removeAllEvents();
            calendar.addEventSource(filteredEvents);
            document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        };
    }

    // Contact class
    function Contact() {
        this.FullName = "";
        this.ContactNumber = "";
        this.EmailAddress = "";
    }

    Contact.prototype.serialize = function() {
        if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
            return `${this.FullName}, ${this.ContactNumber}, ${this.EmailAddress}`;
        } else {
            console.error("One or more of the properties of the contact object are missing or invalid");
            return null;
        }
    };

    Contact.prototype.deserialize = function(data) {
        let propertyArray = data.split(",").map(prop => prop.trim());
        if (propertyArray.length === 3) {
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        } else {
            console.error("Data is not properly formatted.");
        }
    };

    window.addEventListener("load", Start);
})();