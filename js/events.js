let eventErea;
const sortContainer = document.getElementById('sort-container');

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

        fetchUserEvents(userDetails.user_id);
    } else {
        console.log('User details not found in local storage.');
    }
    eventErea = document.getElementById("events-container");
};

async function fetchUserEvents(userId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventHistory/?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const result = await response.json();
        console.log('API response:', result);
        const events = result.events || result.data || result.eventList;
        if (result.success && Array.isArray(events)) {
            populateEventDetails(events);
        } else {
            console.error('No events found or invalid data format');
        }
    } catch (error) {
        console.error('Error fetching user events:', error);
    }
}


function populateEventDetails(events) {
    const eventsContainer = document.getElementById('events-container');
    const eventTemplate = document.querySelector('.events-item'); // Use document.querySelector to get the template

    // Clear any existing events except the template
    eventsContainer.innerHTML = '';

    events.forEach(event => {
        // Clone the template
        const eventItem = eventTemplate.cloneNode(true);
        eventItem.style.display = 'block';
        eventItem.querySelector('h1').textContent = event.event_name;
        eventItem.querySelector('.spanDate').textContent = event.date_and_time;
        eventItem.querySelector('.spanPlace').textContent = event.address;
        eventItem.querySelector('.spanStatus').textContent = event.event_status;
        const eventPhotoElement = eventItem.querySelector('.iconEventContainer img');
        if (eventPhotoElement) {
            eventPhotoElement.src = event.event_photo;
            eventPhotoElement.alt = 'Event Photo';
        } else {
            const newImg = document.createElement('img');
            newImg.src = event.event_photo;
            newImg.alt = 'Event Photo';
            document.querySelector('.iconEventContainer').appendChild(newImg);
        }
        const eventPlaceElement = eventItem.querySelector('.event-item-container');
        if (eventPlaceElement) {
            eventPlaceElement.innerHTML = `<p>:זירת האירוע</p>`;
        }
        eventsContainer.appendChild(eventItem);
    });
}
