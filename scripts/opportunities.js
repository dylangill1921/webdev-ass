/*
Name: Dylan Gill & Joel Hieckert
Class Code: INFT-2202-03
Description: 
*/

// An array of objects for opportunities
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

// Populate the page with different opportunities for someone to see if they want to volunteer after the dom is loaded
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('opportunitiesContainer');
    opportunities.forEach(opportunity => {
        const cardHtml = `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${opportunity.title}</h5>
                    <p class="card-text">${opportunity.description}</p>
                    <p class="card-text"><small class="text-muted">${opportunity.date} at ${opportunity.time}</small></p>
                    <button class="btn btn-primary" onclick="openModal('${opportunity.title}')">Sign Up</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
});

document.getElementById('opportunitiesContainer').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-primary')) {
        const title = event.target.closest('.card').querySelector('.card-title').textContent;
        openModal(title);
    }
});

// Opens the modal to allow someone to volunteer for an opportunity 
function openModal(title) {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.innerText = `Sign Up for ${title}`;
    $('#signUpModal').modal('show');
}

// Handles all form signups for an oppurtunity
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

// Hide the modal if the cancel button was clicked
document.getElementById('cancelButton').addEventListener('click', function() {
    $('#signUpModal').modal('hide');
});