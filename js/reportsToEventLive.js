window.onload = () => {
    fetchEventData();
};

async function fetchEventData() {
    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/eventLive');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                displayEvents(data.eventLiveReports);
            } else {
                console.error('Failed to fetch events:', data.message);
            }
        } else {
            console.error('Failed to fetch events:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function displayEvents(events) {
    const eventContainer = document.getElementById('eventContainer');
    eventContainer.innerHTML = ''; // Clear previous content if any
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        
        const eventName = document.createElement('p');
        eventName.textContent = `שם אירוע: ${event.event_name}`;
        eventElement.appendChild(eventName);
        
        const eventStatus = document.createElement('p');
        eventStatus.textContent = `סטטוס אירוע: ${event.event_status}`;
        eventElement.appendChild(eventStatus);
        
        const eventType = document.createElement('p');
        eventType.textContent = `סוג אירוע: ${event.type_event}`;
        eventElement.appendChild(eventType);
        
        eventContainer.appendChild(eventElement);
    });
}
