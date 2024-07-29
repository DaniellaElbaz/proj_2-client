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
    const eventMapContainer = document.querySelector('.event-map-container');

    if (!dateElement || !highPossibilityEventsElement || !eventMapContainer) {
        console.error('One or more elements not found in the DOM.');
        return;
    }

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
            eventMapContainer.innerHTML = '';

            const dateDiv = document.createElement('div');
            dateDiv.textContent = `${new Date(result.eventNotification[0].date).toLocaleDateString()}`;
            dateElement.appendChild(dateDiv);

            const mapDiv = document.createElement('div');
            mapDiv.innerHTML = `<img src="images/${result.eventNotification[0].day_map}" alt="Day Map" class="eventMap">`;
            eventMapContainer.appendChild(mapDiv);

            const ul = document.createElement('ul');
            ul.classList.add('eventListMDA');

            result.eventNotification.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = notification.notfication;
                li.classList.add('eventItemMDA');
                ul.appendChild(li);
            });

            highPossibilityEventsElement.appendChild(ul);
        } else {
            alert(result.message || 'Load details failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading details.');
    }
}
