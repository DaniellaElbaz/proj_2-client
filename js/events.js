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
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventHistory/`, {
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
    const eventTemplate = document.querySelector('.events-item');
    if (!eventTemplate) {
        console.error('Event template not found');
        return;
    }
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        console.log('Processing event:', event);  // Log the event object to verify properties

        const eventItem = eventTemplate.cloneNode(true);
        eventItem.style.display = 'block';
        eventItem.querySelector('h1').textContent = event.event_name;
        eventItem.querySelector('.spanDate').textContent = event.date_and_time;
        eventItem.querySelector('.spanPlace').textContent = event.address;
        eventItem.querySelector('.spanStatus').textContent = event.event_status;

        const mapElement = eventItem.querySelector('td img');
        if (mapElement) {
            mapElement.src = event.map || '';
            mapElement.alt = 'Event Map';
        } else {
            console.error('Map image element not found in template');
        }

        const iconEventContainer = eventItem.querySelector('.iconEventContainer');
        if (iconEventContainer) {
            let eventPhotoElement = iconEventContainer.querySelector('img');
            if (!eventPhotoElement) {
                eventPhotoElement = document.createElement('img');
                iconEventContainer.appendChild(eventPhotoElement);
            }
            eventPhotoElement.src = event.event_photo || '';
            eventPhotoElement.alt = 'Event Photo';
        } else {
            console.error('IconEventContainer not found in template');
        }

        const eventPlaceElement = eventItem.querySelector('.event-item-container');
        if (eventPlaceElement) {
            eventPlaceElement.innerHTML = `<p>:זירת האירוע</p>${event.address}`;
        } else {
            console.error('Event item container not found in template');
        }

        const reportButton = eventItem.querySelector('#reportButton');
        if (reportButton) {
            reportButton.onclick = () => {
                console.log("Event ID before navigation:", event.event_id);  // Use event.event_id
                navigateToReportPage(event);
            };
        } else {
            console.error('Report button not found in template');
        }

        eventsContainer.appendChild(eventItem);
    });
}
function navigateToReportPage(event) {
    console.log("Event ID before navigation:", event.event_id);  // Verify the correct property name
    const queryParams = new URLSearchParams({
        eventName: event.event_name,
        eventType: event.type_event,
        eventDate: event.date_and_time,
        eventId: event.event_id,  // Use event.event_id
        eventAddress: event.address,
        eventStatus: event.event_status
    }).toString();

    console.log("Constructed URL:", `event_report.html?${queryParams}`);
    window.location.href = `event_report.html?${queryParams}`;
}

