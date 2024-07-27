async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Sending login request with:', { username, password });

    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/account/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        console.log('Response from server:', result);

        if (result.success) {
            window.location.href = 'madaHomePage.html';
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again later.');
    }
}

