/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: auth.ts - Handles authentication
    Date: February 23, 2025
*/
"use strict";
// IIFE - Wraps the entire code to avoid global namespace pollution
(function () {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    function handleLogin() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
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
            });
        }
    }
    function handleLogout() {
        // Save contacts before logout
        const contacts = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('contact_')) {
                contacts[key] = localStorage.getItem(key);
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
    function handleSignup() {
        const signupForm = document.getElementById('registerForm');
        if (signupForm) {
            signupForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const fullName = `${document.getElementById('FirstName').value} ${document.getElementById('lastName').value}`;
                const email = document.getElementById('emailAddress').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                if (password !== confirmPassword) {
                    alert('Error! Passwords do not match...');
                    return;
                }
                if (users.find(u => u.email === email || u.username === email)) {
                    alert('Error! Email or username already registered...');
                    return;
                }
                const newUser = { fullName, username: email, email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                alert('Signup successful! Please log in.');
                window.location.href = '/views/content/login.html';
            });
        }
    }
    function updateNavbar(isLoggedIn) {
        const authNav = document.getElementById('authNav');
        if (authNav) {
            if (isLoggedIn) {
                authNav.innerHTML = `<a class="nav-link" href="#" onclick="logout()">Log Out</a>`;
            }
            else {
                authNav.innerHTML = `<a class="nav-link" href="/views/content/login.html">Log In</a>`;
            }
        }
    }
    window.logout = function () {
        handleLogout();
    };
    function checkLoginStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (currentUser) {
            updateNavbar(true);
            displayWelcomeMessage(currentUser.fullName);
        }
        else {
            updateNavbar(false);
        }
    }
    function displayWelcomeMessage(fullName) {
        var _a;
        if (window.location.pathname.split('/').pop() === 'index.html') {
            const mainContent = document.getElementsByTagName("main")[0];
            const welcomeMessage = document.createElement("p");
            welcomeMessage.textContent = `Welcome, ${fullName}!`;
            welcomeMessage.style.color = '#e31837';
            welcomeMessage.classList.add('mt-3');
            mainContent.insertBefore(welcomeMessage, ((_a = mainContent.firstChild) === null || _a === void 0 ? void 0 : _a.nextSibling) || null);
        }
    }
    window.addEventListener('load', function () {
        checkLoginStatus();
        handleLogin();
        handleSignup();
    });
})();
//# sourceMappingURL=auth.js.map