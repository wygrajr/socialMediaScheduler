const loginFormHandler = async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (email && password) {
        const response = await fetch('api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }), // Include the password in the request body
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert('Failed to log in.');
        }
    }
};

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
