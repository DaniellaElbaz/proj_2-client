window.onload = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userImage = localStorage.getItem('userImage');
    const userName = localStorage.getItem('userName');
    if (userDetails && userImage && userName) {
        const managerImage = document.getElementById('user-image');
        const userNameElement = document.getElementById('user-name');
        if (managerImage) {
            managerImage.src = userImage;
        }
        if (userNameElement) {
            userNameElement.innerText = userName;
        }
    } else {
        console.log('User details not found in local storage.');
    }
    getAllNotification();
};

async function getAllNotification() {
    const dateElement = document.getElementById('dataAndTime');
    const highPossibilityEventsElement = document.getElementById('highPossibilityEvents');
    const mapPointsElement = document.getElementById('mapPoints');

    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/madaHomePage/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        console.log('Response from server:', result);

        if (result.success) {
            dateElement.innerHTML = '';
            highPossibilityEventsElement.innerHTML = '';
            mapPointsElement.innerHTML = '';

            result.eventNotification.forEach(notification => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('eventDiv');
                eventDiv.innerHTML =` <span class="bullet-point">•</span> ${notification.notfication}`;
                highPossibilityEventsElement.appendChild(eventDiv);
            });
        } else {
            alert(result.message || 'Load details failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading details.');
    }
}
