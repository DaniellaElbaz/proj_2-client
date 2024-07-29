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
    getEvents();
};
async function getEvents() {
    const eventMDAList = document.getElementById('eventMDAList');
    
    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/eventType/MDA', {
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
            eventMDAList.innerHTML = '';
            result.events.forEach(event => {
                const eventDivMDA = document.createElement('div');
                eventDivMDA.classList.add('eventMDAListItem');
                eventDivMDA.innerHTML = createEventHTML(event);
                eventMDAList.appendChild(eventDivMDA);
            });
        } else {
            alert(result.message || 'Load types failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading types.');
    }
}

function createEventHTML(event) {
    return `
        <div class="event-details">
        <div class = "timeDate">
            <p class="eventTime">שעה: ${event.time}</p>
            <p class="eventDate">תאריך: ${new Date(event.date).toLocaleDateString()}</p>
            </div>
            <h3 class="eventTitle">${event.event_name}</h3>
            <p class="eventPlace">מקום האירוע: ${event.place}</p>
            <p class="eventStatus">סטטוס: ${event.status}</p>
        </div>
        <div class="image-container">
            <img src="images/${event.map}" alt="Event Map" class="eventMapImage">
        </div>
    `;
}