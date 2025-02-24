/*
    Name: Dylan Gill & Joel Hieckert
    Class Code: INFT-2202-03
    Description: auth.js
    Date: February 23, 2025
*/

"use strict";

// IIFE - Wraps the entire code to avoid global namespace pollution
(function() {
    // Stores user data, loaded from or saved to localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Handles login form submission and authentication
    function handleLogin() {
        // Gets the login form element
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Adds submit listener to the login form
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
                // Gets username and password from form
                const username = document.getElementById('contactName').value;
                const password = document.getElementById('password').value;
                const user = users.find(u => u.username === username && u.password === password);

                // Checks if user exists and credentials match
                if (user) {
                    // Saves current user to localStorage for persistence
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Login successful!');
                    updateNavbar(true);
                    window.location.href = 'index.html';
                    displayWelcomeMessage(user.fullName);
                } else {
                    // Shows error for invalid credentials
                    alert('Error! Invalid username or password...');
                }
            });
        }
    }

    // Handles signup form submission 
    function handleSignup() {
        // Gets the signup form element
        const signupForm = document.getElementById('registerForm');
        if (signupForm) {
            // Adds submit listener to the signup form
            signupForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const fullName = `${document.getElementById('FirstName').value} ${document.getElementById('lastName').value}`;
                const email = document.getElementById('emailAddress').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                // Checks if passwords match
                if (password !== confirmPassword) {
                    // Shows error for mismatched passwords
                    alert('Error! Passwords do not match...');
                    return;
                }

                // Checks if email or username is already registered
                if (users.find(u => u.email === email || u.username === email)) {
                    alert('Error! Email or username already registered...');
                    return;
                }

                // Creates new user object
                const newUser = { fullName, username: email, email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Signup successful! Please log in.');
                window.location.href = 'login.html';
            });
        }
    }

    // Updates the navbar based on login status
    function updateNavbar(isLoggedIn) {
        // Gets the auth navigation element
        const authNav = document.getElementById('authNav');
        if (authNav) {
            if (isLoggedIn) {
                authNav.innerHTML = `<a class="nav-link" href="#" onclick="logout()">Log Out</a>`;
            } else {
                authNav.innerHTML = `<a class="nav-link" href="login.html">Log In</a>`;
            }
        }
    }

    // Logs out the current user and updates the navbar
    window.logout = function() {
        localStorage.removeItem('currentUser');
        updateNavbar(false);
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    };

    // Checks and updates login status when the page loads
    function checkLoginStatus() {
        // Gets current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // Updates navbar based on login status
        if (currentUser) {
            updateNavbar(true);
            displayWelcomeMessage(currentUser.fullName);
        } else {
            updateNavbar(false);
        }
    }

    // Displays a personalized welcome message for the user
    function displayWelcomeMessage(fullName) {
        if (window.location.pathname.includes('index.html')) {
            const mainContent = document.getElementsByTagName("main")[0];
            const welcomeMessage = document.createElement("p");
            welcomeMessage.textContent = `Welcome, ${fullName}!`;
            welcomeMessage.style.color = '#e31837';
            welcomeMessage.classList.add('mt-3');
            mainContent.insertBefore(welcomeMessage, mainContent.firstChild.nextSibling);
        }
    }

    /**
     * Initializes authentication functionality when the page loads
     * @returns {void}
     */
    window.addEventListener('load', function() {
        checkLoginStatus();
        handleLogin();
        handleSignup();
    });
})();