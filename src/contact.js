/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: contact.ts
    Date: March 22, 2025
*/
"use strict";
class Contact {
    constructor() {
        this.FullName = "";
        this.ContactNumber = "";
        this.EmailAddress = "";
        this.Message = "";
    }
    serialize() {
        if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
            return `${this.FullName},${this.ContactNumber},${this.EmailAddress},${this.Message || ''}`;
        }
        else {
            console.error("Error! Missing required fields...");
            return null;
        }
    }
    deserialize(data) {
        const propertyArray = data.split(",").map(prop => prop.trim());
        if (propertyArray.length >= 3) {
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
            this.Message = propertyArray[3] || "";
        }
        else {
            console.error("Error! Data is not properly formatted...");
        }
    }
}
export function DisplayContactListPage() {
    console.log("Contact List Page");
    const contactList = document.getElementById("contactList");
    if (localStorage.length > 0 && contactList) {
        let data = "";
        const keys = Object.keys(localStorage);
        let index = 1;
        for (const key of keys) {
            const contactData = localStorage.getItem(key);
            if (!contactData || !key.startsWith("contact_"))
                continue;
            const contact = new Contact();
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
export function initializeContactPage() {
    console.log("Contact page initialized...");
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            var _a;
            event.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const contactNumber = document.getElementById('contactNumber').value;
            const emailAddress = document.getElementById('emailAddress').value;
            const message = ((_a = document.getElementById('message')) === null || _a === void 0 ? void 0 : _a.value) || '';
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
            }
            else {
                alert('Error! Please fill out all required fields...');
            }
        });
        const cancelButton = document.getElementById('cancelButton');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                contactForm.reset();
            });
        }
    }
    const showContactListBtn = document.getElementById('showContactListBtn');
    if (showContactListBtn) {
        showContactListBtn.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = 'contact-list.html';
        });
    }
}
// These must stay global if used 
window.deleteContact = function (key) {
    if (confirm('Are you sure you want to delete this contact?')) {
        localStorage.removeItem(key);
        DisplayContactListPage();
    }
};
window.editContact = function (key) {
    const contactData = localStorage.getItem(key);
    if (contactData) {
        const contact = new Contact();
        contact.deserialize(contactData);
        document.getElementById('fullName').value = contact.FullName;
        document.getElementById('contactNumber').value = contact.ContactNumber;
        document.getElementById('emailAddress').value = contact.EmailAddress;
        localStorage.removeItem(key);
        alert('Edit the form and submit to update this contact...');
    }
};
