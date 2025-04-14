/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: app.ts
    Date: March 22, 2025
*/
import { Router, loadContent } from './router.js';
import { DisplayContactListPage, initializeContactPage } from './contact.js';
import { DisplayOpportunitiesPage } from './opportunities.js';
import { loadGallery } from './gallery.js';
import { handleLogin, handleSignup, updateNavigation, handleLogout, getCurrentUserName, isLoggedIn } from './auth.js';
import { initializeEventsPage } from './events.js';
"use strict";
function displayHomePage() {
    console.log("Home Page");
    loadContent('./views/components/index-main.html', 'mainContent')
        .then(() => {
        if (isLoggedIn()) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'alert alert-success text-center mb-4';
            welcomeMessage.innerHTML = `<h3>Welcome back, ${getCurrentUserName()}! 🎉</h3>
                    <p>Thank you for being part of our community.</p>`;
            const mainContent = document.getElementById('mainContent');
            if (mainContent && mainContent.firstChild) {
                mainContent.insertBefore(welcomeMessage, mainContent.firstChild);
            }
        }
    });
    loadMemes();
}
function displayopportunitiesPage() {
    console.log("Displaying Opportunities Page...");
    loadContent('./views/components/oppurtunities-main.html', 'mainContent').then(() => {
        DisplayOpportunitiesPage();
    });
}
function displayEventsPage() {
    console.log("Events Page");
    loadContent('./views/components/events-main.html', 'mainContent')
        .then(() => {
        initializeEventsPage();
    });
}
function displayAboutPage() {
    console.log("Displaying About Page...");
    loadContent('./views/components/about-main.html', 'mainContent');
}
function displayContactPage() {
    console.log("Display Contact Page...");
    loadContent('./views/components/contact-main.html', 'mainContent').then(() => {
        initializeContactPage();
    });
}
function displayContactListPage() {
    console.log("Display Contact List Page...");
    loadContent('./views/components/contactlist-main.html', 'mainContent').then(() => {
        DisplayContactListPage();
    });
}
function displayGalleryPage() {
    console.log("Displaying Gallery Page...");
    loadContent('./views/components/gallery-main.html', 'mainContent').then(() => {
        loadGallery();
    });
}
function displayPrivacyPage() {
    console.log("Privacy Policy Page");
    loadContent('./views/components/privacy-main.html', 'mainContent');
}
function displayTermsPage() {
    console.log("Displaying Terms Page...");
    loadContent('./views/components/terms-main.html', 'mainContent');
}
function displayLoginPage() {
    console.log("Displaying Login Page...");
    loadContent('./views/components/login-main.html', 'mainContent')
        .then(() => {
        handleLogin();
    });
}
function displayRegisterPage() {
    console.log("Displaying Register Page...");
    loadContent('./views/components/register-main.html', 'mainContent')
        .then(() => {
        handleSignup();
    });
}
function loadMemes() {
    fetch('https://api.mememaker.net/v1/memes')
        .then(response => response.json())
        .then((data) => {
        const memeDisplay = document.getElementById('memeDisplay');
        if (memeDisplay) {
            if (data && data.length > 0) {
                const randomMeme = data[Math.floor(Math.random() * data.length)];
                memeDisplay.innerHTML = `<img src="${randomMeme.imageUrl}" alt="Community Meme">`;
            }
            else {
                memeDisplay.innerHTML = '<p>No memes available at the moment.</p>';
            }
        }
    })
        .catch(error => {
        console.error('Error loading memes:', error);
        const memeDisplay = document.getElementById('memeDisplay');
        if (memeDisplay) {
            memeDisplay.innerHTML = '<p>Failed to load memes. Please try again later.</p>';
        }
    });
}
function Start() {
    console.log("App starting...");
    const router = new Router();
    // Define Routes
    router.addRoute('/', displayHomePage);
    router.addRoute('/opportunities', displayopportunitiesPage);
    router.addRoute('/events', displayEventsPage);
    router.addRoute('/about', displayAboutPage);
    router.addRoute('/contact', displayContactPage);
    router.addRoute('/contactlist', displayContactListPage);
    router.addRoute('/gallery', displayGalleryPage);
    router.addRoute('/privacy', displayPrivacyPage);
    router.addRoute('/terms', displayTermsPage);
    router.addRoute('/login', displayLoginPage);
    router.addRoute('/register', displayRegisterPage);
    router.addRoute('/404', () => {
        loadContent('./views/components/404.html', 'mainContent');
    });
    router.init();
    // Initialize authentication state
    updateNavigation();
    // Handle logout click
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            handleLogout();
        });
    }
    // Event Delegation for SPA links and Navbar close
    document.addEventListener('click', (event) => {
        const targetElement = event.target;
        const navLink = targetElement.closest('a[href^="#/"]');
        if (navLink) {
            event.preventDefault();
            const path = navLink.getAttribute('href');
            // Close Navbar Logic
            const navbarToggler = document.querySelector('.navbar-toggler');
            const collapseElement = document.querySelector('.navbar-collapse');
            // Check if the link is inside the collapsible navbar and if the navbar is open
            if (navLink.closest('.navbar-collapse') && (collapseElement === null || collapseElement === void 0 ? void 0 : collapseElement.classList.contains('show'))) {
                // Check if toggler is visible 
                if (navbarToggler && getComputedStyle(navbarToggler).display !== 'none') {
                    navbarToggler.click();
                }
            }
            if (path) {
                setTimeout(() => {
                    router.navigate(path);
                }, 50);
            }
        }
    });
}
window.addEventListener("load", Start);
