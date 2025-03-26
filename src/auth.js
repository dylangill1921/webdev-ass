export function handleSignup() {
    const signupForm = document.getElementById('registerForm');
    if (!signupForm)
        return;
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const firstName = document.getElementById('FirstName').value;
        const lastName = document.getElementById('lastName').value;
        const fullName = `${firstName} ${lastName}`;
        const email = document.getElementById('emailAddress').value;
        const phone = document.getElementById('phoneNumber').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email || u.username === email)) {
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
        alert('Signup successful! Please log in.');
        router.navigate('/login'); // SPA-friendly
    });
}
