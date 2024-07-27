window.onload = () => {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        console.log('Sending login request with:', { username, password });
        try {
            const response = await fetch('https://proj-2-ffwz.onrender.com/api/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Response from server:', result);

            if (result.success) {
                const certificationType = result.user.certification_type;
                const userImage = `images/${result.user.user_photo}`;
                const userName = `${result.user.first_name}`;
                localStorage.setItem('userDetails', JSON.stringify(result.user));
                localStorage.setItem('userImage', userImage);
                localStorage.setItem('userName', userName);
                if (certificationType === 'Medical' || certificationType === 'Security') {
                    window.location.href = 'eventLive.html';
                } else {
                    window.location.href = 'madaHomePage.html';
                }
            } else {
                alert(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    });
};
