import { Router } from './router.js';
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
            const session = {
                username: user.username,
                fullName: user.fullName,
                isLoggedIn: true
            };
            localStorage.setItem('currentSession', JSON.stringify(session));
            updateNavigation();
            alert(`Welcome back, ${user.fullName}!`);
            const router = new Router();
            router.navigate('/');
        }
        else {
            console.log("Invalid login attempt");
            alert('Invalid username or password.');
        }
    });
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
        alert('Registration successful! Please log in with your email and password.');
        const router = new Router();
        router.navigate('/login');
    });
}
export function handleLogout() {
    console.log("Handling logout");
    localStorage.removeItem('currentSession');
    updateNavigation();
    alert('You have been logged out successfully.');
    const router = new Router();
    router.navigate('/');
    setTimeout(() => {
        window.location.reload();
    }, 100);
}
export function isLoggedIn() {
    const session = localStorage.getItem('currentSession');
    return session !== null && JSON.parse(session).isLoggedIn;
}
export function getCurrentUserName() {
    const session = localStorage.getItem('currentSession');
    return session ? JSON.parse(session).fullName : '';
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
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing auth state");
    updateNavigation();
});
//# sourceMappingURL=auth.js.map