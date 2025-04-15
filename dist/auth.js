import { Router } from './router.js';
let users = JSON.parse(localStorage.getItem('users') || '[]');
export function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('contactName').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        updateNavbar(true);
        window.location.href = '/index.html';
        displayWelcomeMessage(user.fullName);
    }
    else {
        alert('Error! Invalid username or password...');
    }
}
export function handleSignup() {
    console.log("Setting up signup handler");
    const signupForm = document.getElementById('registerForm');
    if (!signupForm) {
        console.error("Register form not found");
        return;
    }
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Register form submitted");
        const firstName = document.getElementById('FirstName').value;
        const lastName = document.getElementById('lastName').value;
        const fullName = `${firstName} ${lastName}`;
        const email = document.getElementById('emailAddress').value;
        const phone = document.getElementById('phoneNumber').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
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
        const newUser = {
            fullName,
            username: email,
            email,
            phone,
            password
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log("User registered successfully");
        if (window.statistics) {
            window.statistics.trackNewMember();
        }
        alert('Registration successful! Please log in with your email and password.');
        const router = new Router();
        router.navigate('/login');
    });
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