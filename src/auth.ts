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

// Function to handle user login
export function handleLogin(): void {
    console.log("Setting up login handler");
    const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
    if (!loginForm) {
        console.error("Login form not found");
        return;
    }

    loginForm.addEventListener('submit', function (event: Event) {
        event.preventDefault();
        console.log("Login form submitted");

        const username = (document.getElementById('userName') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        console.log("Found users:", users.length);
        
        const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

        if (user) {
            console.log("User found, creating session");
            // Create session
            const session: Session = {
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
        } else {
            console.log("Invalid login attempt");
            alert('Invalid username or password.');
        }
    });
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

        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        console.log("Current users:", users.length);

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
export function isLoggedIn(): boolean {
    const session = localStorage.getItem('currentSession');
    return session !== null && JSON.parse(session).isLoggedIn;
}

// Function to get current user's full name
export function getCurrentUserName(): string {
    const session = localStorage.getItem('currentSession');
    return session ? JSON.parse(session).fullName : '';
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

// Initialize auth state when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing auth state");
    updateNavigation();
});
