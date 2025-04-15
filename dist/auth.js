import { StatisticsManager } from './statistics.js';
let users = JSON.parse(localStorage.getItem('users') || '[]');
export function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('#emailAddress')?.value;
    const password = form.querySelector('#password')?.value;
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.hash = '#/';
        updateNavigation();
    }
    else {
        alert('Invalid email or password');
    }
}
export function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const firstName = form.querySelector('#FirstName')?.value;
    const lastName = form.querySelector('#lastName')?.value;
    const email = form.querySelector('#emailAddress')?.value;
    const phone = form.querySelector('#phoneNumber')?.value;
    const password = form.querySelector('#password')?.value;
    const confirmPassword = form.querySelector('#confirmPassword')?.value;
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all required fields.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    const fullName = `${firstName} ${lastName}`;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
        fullName,
        username: email,
        email,
        phone,
        password
    };
    if (users.some((u) => u.email === email)) {
        alert('Email already registered.');
        return;
    }
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    StatisticsManager.getInstance().trackMemberRegistration();
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    alert('Registration successful!');
    window.location.hash = '#/';
    updateNavigation();
}
export function handleLogout() {
    const contacts = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('contact_')) {
            const value = localStorage.getItem(key);
            if (value)
                contacts[key] = value;
        }
    });
    localStorage.removeItem('currentUser');
    Object.keys(contacts).forEach(key => {
        localStorage.setItem(key, contacts[key]);
    });
    updateNavbar(false);
    window.location.href = '/index.html';
    setTimeout(() => {
        window.location.reload();
    }, 100);
}
export function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}
export function getCurrentUserName() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        return JSON.parse(user).fullName;
    }
    return null;
}
export function updateNavigation() {
    console.log("Updating navigation");
    const loginLink = document.querySelector('a[href="#/login"]')?.parentElement;
    const registerLink = document.querySelector('a[href="#/register"]')?.parentElement;
    const logoutLink = document.getElementById('logoutLink')?.parentElement;
    const userWelcome = document.getElementById('userWelcome');
    if (isLoggedIn()) {
        console.log("User is logged in");
        if (loginLink)
            loginLink.style.display = 'none';
        if (registerLink)
            registerLink.style.display = 'none';
        if (logoutLink)
            logoutLink.style.display = 'block';
        if (userWelcome) {
            userWelcome.style.display = 'block';
            const welcomeSpan = userWelcome.querySelector('span');
            if (welcomeSpan) {
                welcomeSpan.textContent = `Welcome, ${getCurrentUserName()}!`;
            }
        }
    }
    else {
        console.log("User is not logged in");
        if (loginLink)
            loginLink.style.display = 'block';
        if (registerLink)
            registerLink.style.display = 'block';
        if (logoutLink)
            logoutLink.style.display = 'none';
        if (userWelcome)
            userWelcome.style.display = 'none';
    }
}
function updateNavbar(isLoggedIn) {
    const authNav = document.getElementById('authNav');
    if (authNav) {
        if (isLoggedIn) {
            authNav.innerHTML = `<a class="nav-link" href="#" onclick="handleLogout()">Log Out</a>`;
        }
        else {
            authNav.innerHTML = `<a class="nav-link" href="/views/content/login.html">Log In</a>`;
        }
    }
}
function displayWelcomeMessage(fullName) {
    if (window.location.pathname.split('/').pop() === 'index.html') {
        const mainContent = document.getElementsByTagName("main")[0];
        const welcomeMessage = document.createElement("p");
        welcomeMessage.textContent = `Welcome, ${fullName}!`;
        welcomeMessage.style.color = '#e31837';
        welcomeMessage.classList.add('mt-3');
        mainContent.insertBefore(welcomeMessage, mainContent.firstChild?.nextSibling || null);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing auth state");
    updateNavigation();
});
//# sourceMappingURL=auth.js.map