/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: app.ts - Main entry point for the app
    Date: February 23, 2025
*/
import { Router, loadContent } from './router';
import { DisplayContactListPage, initializeContactPage } from './contact';
import { DisplayOpportunitiesPage } from './opportunities';
"use strict";
function displayHomePage() {
    console.log("Displaying Home Page...");
    loadContent('/views/components/index-main.html', 'mainContent');
    loadMemes();
}
function displayopportunitiesPage() {
    console.log("Displaying Opportunities Page...");
    loadContent('/views/components/opportunities-main.html', 'mainContent');
    DisplayOpportunitiesPage();
}
function displayEventsPage() {
    console.log("Events Page");
    loadContent('/views/components/events-main.html', 'mainContent').then(() => {
    });
}
function displayAboutPage() {
    console.log("Displaying About Page...");
    loadContent('/views/components/about-main.html', 'mainContent');
}
function displayContactPage() {
    console.log("Display Contact Page...");
    loadContent('/views/components/contact-main.html', 'mainContent').then(() => {
        initializeContactPage();
    });
}
function displayContactListPage() {
    console.log("Display Contact List Page...");
    loadContent('/views/components/contactlist-main.html', 'mainContent');
    DisplayContactListPage();
}
function displayGalleryPage() {
    console.log("Displaying Gallery Page...");
    loadContent('/views/components/gallery-main.html', 'mainContent');
}
function displayPrivacyPage() {
    console.log("Privacy Policy Page");
    loadContent('/views/components/privacy-main.html', 'mainContent');
}
function displayTermsPage() {
    console.log("Displaying Terms Page...");
    loadContent('/views/components/terms-main.html', 'mainContent');
}
function displayLoginPage() {
    console.log("Displaying Login Page...");
    loadContent('/views/components/login-main.html', 'mainContent');
}
function displayRegisterPage() {
    console.log("Displaying Register Page...");
    loadContent('/views/components/register-main.html', 'mainContent');
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
    router.addRoute('/', displayHomePage);
    router.addRoute('/', displayHomePage);
    router.addRoute('/oppurtunities', displayopportunitiesPage);
    router.addRoute('/events', displayEventsPage);
    router.addRoute('/about', displayAboutPage);
    router.addRoute('/contact', displayContactPage);
    router.addRoute('/contactlist', displayContactListPage);
    router.addRoute('gallery', displayGalleryPage);
    router.addRoute('privacy', displayPrivacyPage);
    router.addRoute('terms', displayTermsPage);
    router.addRoute('login', displayLoginPage);
    router.addRoute('register', displayRegisterPage);
    router.addRoute('/404', () => {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = '<h2>404 - Page Not Found</h2>';
        }
    });
    router.init();
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const path = link.getAttribute('href');
            if (path) {
                router.navigate(path);
            }
        });
    });
}
window.addEventListener("load", Start);
//# sourceMappingURL=app.js.map