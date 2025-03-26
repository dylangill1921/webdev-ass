/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: contact.ts
    Date: March 22, 2025
*/

"use strict";

interface IContact {
    FullName: string;
    ContactNumber: string;
    EmailAddress: string;
    Message: string;
}

class Contact implements IContact {
    public FullName = "";
    public ContactNumber = "";
    public EmailAddress = "";
    public Message = "";

    public serialize(): string | null {
        if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
            return `${this.FullName},${this.ContactNumber},${this.EmailAddress},${this.Message || ''}`;
        } else {
            console.error("Error! Missing required fields...");
            return null;
        }
    }

    public deserialize(data: string): void {
        const propertyArray = data.split(",").map(prop => prop.trim());
        if (propertyArray.length >= 3) {
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
            this.Message = propertyArray[3] || "";
        } else {
            console.error("Error! Data is not properly formatted...");
        }
    }
}

export function DisplayContactListPage(): void {
    console.log("Contact List Page");

    const contactList = document.getElementById("contactList");
    if (localStorage.length > 0 && contactList) {
        let data = "";
        const keys = Object.keys(localStorage);
        let index = 1;

        for (const key of keys) {
            const contactData = localStorage.getItem(key);
            if (!contactData || !key.startsWith("contact_")) continue;

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

export function initializeContactPage(): void {
    console.log("Contact page initialized...");

    const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
    if (contactForm) {
        contactForm.addEventListener('submit', function (event: Event): void {
            event.preventDefault();

            const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
            const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
            const emailAddress = (document.getElementById('emailAddress') as HTMLInputElement).value;
            const message = (document.getElementById('message') as HTMLInputElement | null)?.value || '';

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

        const cancelButton = document.getElementById('cancelButton');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                contactForm.reset();
            });
        }
    }

    const showContactListBtn = document.getElementById('showContactListBtn');
    if (showContactListBtn) {
        showContactListBtn.addEventListener('click', function (event: Event): void {
            event.preventDefault();
            window.location.href = 'contact-list.html';
        });
    }
}

// These must stay global if used 
(window as any).deleteContact = function (key: string): void {
    if (confirm('Are you sure you want to delete this contact?')) {
        localStorage.removeItem(key);
        DisplayContactListPage();
    }
};

(window as any).editContact = function (key: string): void {
    const contactData = localStorage.getItem(key);
    if (contactData) {
        const contact = new Contact();
        contact.deserialize(contactData);

        (document.getElementById('fullName') as HTMLInputElement).value = contact.FullName;
        (document.getElementById('contactNumber') as HTMLInputElement).value = contact.ContactNumber;
        (document.getElementById('emailAddress') as HTMLInputElement).value = contact.EmailAddress;

        localStorage.removeItem(key);
        alert('Edit the form and submit to update this contact...');
    }
};
