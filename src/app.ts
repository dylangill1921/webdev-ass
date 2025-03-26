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

"use strict";

function displayHomePage(): void {
    console.log("Displaying Home Page...");
    loadContent('./views/components/index-main.html', 'mainContent');
    loadMemes();
}

function displayopportunitiesPage(): void {
    console.log("Displaying Opportunities Page...");
    loadContent('./views/components/oppurtunities-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/opp.css');
        DisplayOpportunitiesPage();
    });
}

function displayEventsPage(): void {
    console.log("Events Page");
    loadContent('./views/components/events-main.html', 'mainContent').then(() => {
            loadPageStyle('/content/events.css');
    });
}

function displayAboutPage(): void {
    console.log("Displaying About Page...");
    loadContent('./views/components/about-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/app.css');
    });
}

function displayContactPage(): void {
    console.log("Display Contact Page...");
    loadContent('./views/components/contact-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/cont.css');
        initializeContactPage();
    });
}

function displayContactListPage(): void {
    console.log("Display Contact List Page...");
    loadContent('./views/components/contactlist-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/clist.css');
        DisplayContactListPage();
    });
}

function displayGalleryPage(): void {
    console.log("Displaying Gallery Page...");
    loadContent('./views/components/gallery-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/gal.css');
        loadGallery();
    });
}

function displayPrivacyPage(): void {
    console.log("Privacy Policy Page");
    loadContent('./views/components/privacy-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/terms.css');
});
}

function displayTermsPage(): void {
    console.log("Displaying Terms Page...");
    loadContent('./views/components/terms-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/terms.css');
});
}

function displayLoginPage(): void {
    console.log("Displaying Login Page...");
    loadContent('./views/components/login-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/auth.css');
});
}

function displayRegisterPage(): void {
    console.log("Displaying Register Page...");
    loadContent('./views/components/register-main.html', 'mainContent').then(() => {
        loadPageStyle('/content/auth.css');
});
}

function loadPageStyle(href: string): void {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }
}

interface Meme {
    imageUrl: string;
}

function loadMemes(): void {
    fetch('https://api.mememaker.net/v1/memes')
        .then(response => response.json())
        .then((data: Meme[]) => {
            const memeDisplay = document.getElementById('memeDisplay');
            if (memeDisplay) {
                if (data && data.length > 0) {
                    const randomMeme = data[Math.floor(Math.random() * data.length)];
                    memeDisplay.innerHTML = `<img src="${randomMeme.imageUrl}" alt="Community Meme">`;
                } else {
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

function Start(): void {
    console.log("App starting...");
    const router = new Router();

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
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.innerHTML = '<h2>404 - Page Not Found</h2>';
        }
    });

    router.init();

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event: Event) => {
            event.preventDefault();
            const path = (link as HTMLAnchorElement).getAttribute('href');
            if (path) {
                router.navigate(path);
            }
        });
    });
}

window.addEventListener("load", Start);
