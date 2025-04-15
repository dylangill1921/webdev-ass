import { Router } from './router.js'; // Import Router
// Function to handle user login
export function handleLogin() {
    console.log("Setting up login handler");
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error("Login form not found");
        return;
    }
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Login form submitted");
        const username = document.getElementById('userName').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log("Found users:", users.length);
        const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
        if (user) {
            console.log("User found, creating session");
            // Create session
            const session = {
                username: user.username,
                fullName: user.fullName,
                isLoggedIn: true
            };
            // Store session in localStorage
            localStorage.setItem('currentSession', JSON.stringify(session));
            // Update navigation
            updateNavigation();
            // Show welcome message
            alert(`Welcome back, ${user.fullName}!`);
            // Redirect to home page
            const router = new Router();
            router.navigate('/');
        }
        else {
            console.log("Invalid login attempt");
            alert('Invalid username or password.');
        }
    });
}
// Function to handle user signup
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
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log("Current users:", users.length);
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
        // Track new member in statistics
        if (window.statistics) {
            window.statistics.trackNewMember();
        }
        alert('Registration successful! Please log in with your email and password.');
        const router = new Router();
        router.navigate('/login');
    });
}
// Function to handle user logout
export function handleLogout() {
    console.log("Handling logout");
    localStorage.removeItem('currentSession');
    updateNavigation();
    alert('You have been logged out successfully.');
    const router = new Router();
    router.navigate('/');
    // Add page refresh after a short delay to ensure navigation completes
    setTimeout(() => {
        window.location.reload();
    }, 100);
}
// Function to check if user is logged in
export function isLoggedIn() {
    const session = localStorage.getItem('currentSession');
    return session !== null && JSON.parse(session).isLoggedIn;
}
// Function to get current user's full name
export function getCurrentUserName() {
    const session = localStorage.getItem('currentSession');
    return session ? JSON.parse(session).fullName : '';
}
// Function to update navigation based on login status
export function updateNavigation() {
    var _a, _b, _c;
    console.log("Updating navigation");
    const loginLink = (_a = document.querySelector('a[href="#/login"]')) === null || _a === void 0 ? void 0 : _a.parentElement;
    const registerLink = (_b = document.querySelector('a[href="#/register"]')) === null || _b === void 0 ? void 0 : _b.parentElement;
    const logoutLink = (_c = document.getElementById('logoutLink')) === null || _c === void 0 ? void 0 : _c.parentElement;
    const userWelcome = document.getElementById('userWelcome');
    if (isLoggedIn()) {
        console.log("User is logged in");
        // Hide login and register links
        if (loginLink)
            loginLink.style.display = 'none';
        if (registerLink)
            registerLink.style.display = 'none';
        // Show logout link and welcome message
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
        // Show login and register links
        if (loginLink)
            loginLink.style.display = 'block';
        if (registerLink)
            registerLink.style.display = 'block';
        // Hide logout link and welcome message
        if (logoutLink)
            logoutLink.style.display = 'none';
        if (userWelcome)
            userWelcome.style.display = 'none';
    }
}
// Initialize auth state when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing auth state");
    updateNavigation();
});
