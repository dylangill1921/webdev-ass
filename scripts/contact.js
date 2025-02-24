"use strict";

// IIFE - Immediately Invoked Functional Expression
(function() {
    // Initialize contact page functionality
    function initializeContactPage() {
        console.log("Contact page initialized...");

        // Handle contact form submission 
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const fullName = document.getElementById('fullName').value;
                const contactNumber = document.getElementById('contactNumber').value;
                const emailAddress = document.getElementById('emailAddress').value;
                const message = document.getElementById('message').value || ''; 

                const contact = new Contact();
                contact.FullName = fullName;
                contact.ContactNumber = contactNumber;
                contact.EmailAddress = emailAddress;
                contact.Message = message; 

                const serializedData = contact.serialize();
                if (serializedData) {
                    const key = `contact_${Date.now()}`; 
                    localStorage.setItem(key, serializedData);
                    alert('Contact submitted successfully!');
                    contactForm.reset(); 
                } else {
                    alert('Error! Please fill out all required fields...');
                }
            });

            // Cancel button reset
            document.getElementById('cancelButton').addEventListener('click', function() {
                contactForm.reset();
            });
        }

        // Handle show contact button list (button)
        const showContactListBtn = document.getElementById('showContactListBtn');
        if (showContactListBtn) {
            showContactListBtn.addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = 'contact-list.html';
            });
        }
    }

    // Contact class 
    function Contact() {
        this.FullName = "";
        this.ContactNumber = "";
        this.EmailAddress = "";
        this.Message = ""; 
    }

    // Serialize method for Contact class
    Contact.prototype.serialize = function() {
        if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
            return `${this.FullName},${this.ContactNumber},${this.EmailAddress},${this.Message}`;
        } else {
            console.error("ERROR! Invalid data, one or more of the fields required are missing...");
            return null;
        }
    };

    // Deserialize method for Contact class
    Contact.prototype.deserialize = function(data) {
        let propertyArray = data.split(",").map(prop => prop.trim());
        if (propertyArray.length >= 3) { 
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
            this.Message = propertyArray[3] || ""; 
        } else {
            console.error("ERROR! Invalid data...");
        }
    };

    // Load functionality when the page loads
    window.addEventListener("load", initializeContactPage);
})();