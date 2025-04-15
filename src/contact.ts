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

function displayContactList(): void {
    console.log("Displaying contact list...");
    const contactList = document.getElementById("contactList");
    if (!contactList) return;

    // Clear existing content
    contactList.innerHTML = '';

    // Filter and sort contacts
    const contacts = Object.keys(localStorage)
        .filter(key => key.startsWith("contact_"))
        .map(key => {
            const contactData = localStorage.getItem(key);
            if (!contactData) return null;
            const contact = new Contact();
            contact.deserialize(contactData);
            return { key, contact };
        })
        .filter(item => item !== null)
        .sort((a, b) => a!.contact.FullName.localeCompare(b!.contact.FullName));

    if (contacts.length === 0) {
        contactList.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-5">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p class="lead">No contacts found</p>
                    <p class="text-muted">Your contact list is empty</p>
                </td>
            </tr>`;
        return;
    }

    contacts.forEach((item, index) => {
        if (!item) return;
        const { key, contact } = item;
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row" class="text-center">${index + 1}</th>
            <td>${contact.FullName}</td>
            <td>${contact.ContactNumber}</td>
            <td>${contact.EmailAddress}</td>
            <td class="text-center">
                <button class="btn btn-sm custom-btn-red me-2" onclick="editContact('${key}')">
                    <i class="fas fa-edit me-1"></i>Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteContact('${key}')">
                    <i class="fas fa-trash-alt me-1"></i>Delete
                </button>
            </td>
        `;
        contactList.appendChild(row);
    });
}

export function initializeContactPage(): void {
    console.log("Contact page initialized...");

    const contactForm = document.getElementById('contactForm') as HTMLFormElement;
    if (!contactForm) return;

    // Add Bootstrap form validation
    contactForm.addEventListener('submit', function (event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        contactForm.classList.add('was-validated');

        if (!contactForm.checkValidity()) {
            return;
        }

        const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
        const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
        const emailAddress = (document.getElementById('emailAddress') as HTMLInputElement).value;
        const message = (document.getElementById('message') as HTMLTextAreaElement).value;

        const contact = new Contact();
        contact.FullName = fullName;
        contact.ContactNumber = contactNumber;
        contact.EmailAddress = emailAddress;
        contact.Message = message;

        const serializedData = contact.serialize();
        if (serializedData) {
            const key = `contact_${Date.now()}`;
            localStorage.setItem(key, serializedData);
            
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
            successAlert.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>Message sent successfully!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            contactForm.insertAdjacentElement('beforebegin', successAlert);
            
            // Reset form and validation state
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            
            // Update contact list if modal is open
            displayContactList();
        }
    });

    // Handle contact list button
    const showContactListBtn = document.getElementById('showContactListBtn');
    if (showContactListBtn) {
        showContactListBtn.addEventListener('click', function (event: Event): void {
            event.preventDefault();
            displayContactList();
            // @ts-ignore
            const modal = new bootstrap.Modal(document.getElementById('contactListModal'));
            modal.show();
        });
    }

    // Handle form reset
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            contactForm.classList.remove('was-validated');
        });
    }
}

// These must stay global for the onclick handlers
(window as any).deleteContact = function (key: string): void {
    if (confirm('Are you sure you want to delete this contact?')) {
        localStorage.removeItem(key);
        displayContactList();
    }
};

(window as any).editContact = function (key: string): void {
    const contactData = localStorage.getItem(key);
    if (contactData) {
        const contact = new Contact();
        contact.deserialize(contactData);

        // Fill form with contact data
        (document.getElementById('fullName') as HTMLInputElement).value = contact.FullName;
        (document.getElementById('contactNumber') as HTMLInputElement).value = contact.ContactNumber;
        (document.getElementById('emailAddress') as HTMLInputElement).value = contact.EmailAddress;
        (document.getElementById('message') as HTMLTextAreaElement).value = contact.Message;

        // Remove the contact from storage (will be re-added when form is submitted)
        localStorage.removeItem(key);

        // Close the modal
        // @ts-ignore
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactListModal'));
        if (modal) modal.hide();
    }
};
