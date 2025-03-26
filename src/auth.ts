export function handleSignup(): void {
    const signupForm = document.getElementById('registerForm') as HTMLFormElement | null;
    if (!signupForm) return;

    signupForm.addEventListener('submit', function (event: Event) {
        event.preventDefault();

        const firstName = (document.getElementById('FirstName') as HTMLInputElement).value;
        const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
        const fullName = `${firstName} ${lastName}`;
        const email = (document.getElementById('emailAddress') as HTMLInputElement).value;
        const phone = (document.getElementById('phoneNumber') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find(u => u.email === email || u.username === email)) {
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

        alert('Signup successful! Please log in.');
        router.navigate('/login'); // SPA-friendly
    });
}
