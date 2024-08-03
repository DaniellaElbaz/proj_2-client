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
    }
    getEvents();
    liveEventButton();
    fetchEventParticipants(eventId)
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
        <div class="event-details" data-event-id="${event.event_id}">
            <div class="timeDate">
                <p class="eventTime">שעה: ${event.time}</p>
                <p class="eventDate">תאריך: ${new Date(event.date).toLocaleDateString()}</p>
            </div>
            <h3 class="eventTitle">${event.event_name}</h3>
            <p class="eventPlace">מקום האירוע: ${event.place}</p>
            <p class="eventStatus">סטטוס: ${event.status}</p>
            <div class="image-container">
                <img src="images/${event.map}" alt="Event Map" class="eventMapImage">
            </div>
            <div class="button-container">
                <button class="btn-red" data-event-id="${event.event_id}">מחיקת אירוע</button>
                <button class="btn-blue" data-event-id="${event.event_id}">עריכת אירוע</button>
            </div>
        </div>
    `;
}
async function liveEventButton() {
    document.addEventListener('click', async function(event) {
        const eventId = event.target.getAttribute('data-event-id');
        if (event.target.classList.contains('btn-blue')) {
            window.location.href = 'MDAUpdate.html?id=' + eventId;
        } else if (event.target.classList.contains('btn-red') && eventId) {
            const userConfirmed = confirm('Are you sure you want to delete this event?');
            if (userConfirmed) {
                try {
                    const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventType/delete/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    if (result.success) {
                        const eventElement = event.target.closest('.event-details');
                        if (eventElement) {
                            eventElement.remove();
                        }
                        alert('Event deleted successfully');
                         window.location.href = 'liveEventsMDA.html';
                    } else {
                        alert(result.message || 'Failed to delete event');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the event.');
                }
            }
        }
    });
}

