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
};

async function fetchUserEvents(userId) {
    try {
        console.log(`Fetching user events for userId: ${userId}`);
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
        const events = result.data;

        if (result.success && Array.isArray(events)) {
            console.log('Event objects:', events);
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
        eventItem.querySelector('.spanDate').textContent = new Date(event.date_and_time).toLocaleDateString();
        eventItem.querySelector('.spanPlace').textContent = event.address;
        eventItem.querySelector('.spanStatus').textContent = event.event_status;

        const mapElement = eventItem.querySelector('.eventMap');
        if (mapElement) {
            const mapPath = `images/${event.map}`; // Update with correct path
            mapElement.src = mapPath;
            mapElement.alt = 'Event Map';
        } else {
            console.error('Map image element not found in template');
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

