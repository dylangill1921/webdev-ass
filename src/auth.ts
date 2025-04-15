/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: auth.ts - Handles authentication
    Date: February 23, 2025
*/

import { Router } from './router.js'; // Import Router

// Define the User interface
interface User {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string; // Note: Storing passwords in plain text in localStorage is insecure
}

// Define the Session interface
interface Session {
    username: string;
    fullName: string;
    isLoggedIn: boolean;
}

let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

// Function to handle user login
export function handleLogin(event: Event): void {
    event.preventDefault();
    const username = (document.getElementById('contactName') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        updateNavbar(true);
        window.location.href = '/index.html';
        displayWelcomeMessage(user.fullName);
    } else {
        alert('Error! Invalid username or password...');
    }
}

// Function to handle user signup
export function handleSignup(): void {
    console.log("Setting up signup handler");
    const signupForm = document.getElementById('registerForm') as HTMLFormElement | null;
    if (!signupForm) {
        console.error("Register form not found");
        return;
    }

    signupForm.addEventListener('submit', function (event: Event) {
        event.preventDefault();
        console.log("Register form submitted");

        const firstName = (document.getElementById('FirstName') as HTMLInputElement).value;
        const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
        const fullName = `${firstName} ${lastName}`;
        const email = (document.getElementById('emailAddress') as HTMLInputElement).value;
        const phone = (document.getElementById('phoneNumber') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (users.find(u => u.email === email)) {
            alert('Email already registered.');
            return;
        }

        const newUser: User = {
            fullName,
            username: email,
            email,
            phone,
            password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log("User registered successfully");

        // Track new member in statistics
        if ((window as any).statistics) {
            (window as any).statistics.trackNewMember();
        }

        alert('Registration successful! Please log in with your email and password.');
        const router = new Router();
        router.navigate('/login');
    });
}

// Function to handle user logout
export function handleLogout(): void {
    // Save contacts before logout
    const contacts: { [key: string]: string } = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('contact_')) {
            const value = localStorage.getItem(key);
            if (value) contacts[key] = value;
        }
    });

    // Clear only user-specific data
    localStorage.removeItem('currentUser');
    
    // Restore contacts
    Object.keys(contacts).forEach(key => {
        localStorage.setItem(key, contacts[key]);
    });

    updateNavbar(false);
    window.location.href = '/index.html';
    setTimeout(() => {
        window.location.reload();
    }, 100);
}

// Function to check if user is logged in
export function isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
}

// Function to get current user's full name
export function getCurrentUserName(): string | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
        return JSON.parse(user).fullName;
    }
    return null;
}

// Function to update navigation based on login status
export function updateNavigation(): void {
    console.log("Updating navigation");
    const loginLink = document.querySelector('a[href="#/login"]')?.parentElement;
    const registerLink = document.querySelector('a[href="#/register"]')?.parentElement;
    const logoutLink = document.getElementById('logoutLink')?.parentElement;
    const userWelcome = document.getElementById('userWelcome');

    if (isLoggedIn()) {
        console.log("User is logged in");
        // Hide login and register links
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        
        // Show logout link and welcome message
        if (logoutLink) logoutLink.style.display = 'block';
        if (userWelcome) {
            userWelcome.style.display = 'block';
            const welcomeSpan = userWelcome.querySelector('span');
            if (welcomeSpan) {
                welcomeSpan.textContent = `Welcome, ${getCurrentUserName()}!`;
            }
        }
    } else {
        console.log("User is not logged in");
        // Show login and register links
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        
        // Hide logout link and welcome message
        if (logoutLink) logoutLink.style.display = 'none';
        if (userWelcome) userWelcome.style.display = 'none';
    }
}

function updateNavbar(isLoggedIn: boolean): void {
    const authNav = document.getElementById('authNav');
    if (authNav) {
        if (isLoggedIn) {
            authNav.innerHTML = `<a class="nav-link" href="#" onclick="handleLogout()">Log Out</a>`;
        } else {
            authNav.innerHTML = `<a class="nav-link" href="/views/content/login.html">Log In</a>`;
        }
    }
}

function displayWelcomeMessage(fullName: string): void {
    if (window.location.pathname.split('/').pop() === 'index.html') {
        const mainContent = document.getElementsByTagName("main")[0];
        const welcomeMessage = document.createElement("p");
        welcomeMessage.textContent = `Welcome, ${fullName}!`;
        welcomeMessage.style.color = '#e31837';
        welcomeMessage.classList.add('mt-3');
        mainContent.insertBefore(welcomeMessage, mainContent.firstChild?.nextSibling || null);
    }
}

// Initialize auth state when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing auth state");
    updateNavigation();
});
