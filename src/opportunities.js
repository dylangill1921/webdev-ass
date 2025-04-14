/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: opportunities.ts
    Date: March 22, 2025
*/
"use strict";
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
export function DisplayOpportunitiesPage() {
    const container = document.getElementById('opportunitiesContainer');
    if (container) {
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
}
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('opportunitiesContainer');
    if (container) {
        container.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('btn-primary')) {
                const card = target.closest('.card');
                const titleElement = card === null || card === void 0 ? void 0 : card.querySelector('.card-title');
                const title = (titleElement === null || titleElement === void 0 ? void 0 : titleElement.textContent) || '';
                openModal(title);
            }
        });
    }
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailInput = document.getElementById('emailAddress');
            const email = emailInput.value;
            if (email.includes('@')) {
                console.log('Form is valid');
                $('#signUpModal').modal('hide');
                alert('Thank you for signing up!');
            }
            else {
                alert('Please enter a valid email address.');
            }
        });
    }
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', function () {
            $('#signUpModal').modal('hide');
        });
    }
});
window.openModal = function (title) {
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.innerText = `Sign Up for ${title}`;
        $('#signUpModal').modal('show');
    }
};
function openModal(title) {
    throw new Error("Function not implemented.");
}
