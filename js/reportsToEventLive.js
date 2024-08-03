window.onload = () => {
    fetchEventData();
};
async function fetchEventData() {
    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/eventLive/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
            displayEvents(data.eventLiveReports);
        } else {
            console.error('Failed to fetch events:', data.message);
            alert(data.message || 'Failed to fetch events');
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        alert('An error occurred while fetching events. Please try again later.');
    }
}
function displayEvents(events) {
    const eventContainer = document.getElementById('eventContainer');
    eventContainer.innerHTML = '';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        const eventName = document.createElement('p');
        eventName.textContent = `שם אירוע: ${event.event_name}`;
        eventName.className = 'text-item';
        const eventStatus = document.createElement('p');
        eventStatus.textContent = `סטטוס אירוע: ${event.event_status}`;
        eventStatus.className = 'text-item';
        const eventType = document.createElement('p');
        eventType.textContent = `סוג אירוע: ${event.type_event}`;
        eventType.className = 'text-item';
        eventElement.appendChild(eventName);
        eventElement.appendChild(eventStatus);
        eventElement.appendChild(eventType);
        eventContainer.appendChild(eventElement);
    });
}
