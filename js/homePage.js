window.onload = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userImage = localStorage.getItem('userImage');
    const userName = localStorage.getItem('userName');
    const eventData = JSON.parse(localStorage.getItem('eventData'));
    if (userDetails && userImage && userName && eventData) {
        const managerImage = document.getElementById('user-image');
        const userNameElement = document.getElementById('user-name');
        const userEventMap = document.getElementById('eventImage');
        if (managerImage) {
            managerImage.src = userImage;
        }
        if (userNameElement) {
            userNameElement.innerText = userName;
        }
        if (userEventMap && eventData.map) {
            userEventMap.src = `images/${eventData.map}`;
        }
        if (userDetails.place == null) {
            alert("No event");
            window.location.href = "userHomePage.html";
        } else {
            fetchEventData(eventData.event_id);
            fetchUserEventsDetails(userDetails.user_id);
            setupButtonListener(eventData, userDetails.user_id);
        }
    } else {
    }
};
async function fetchEventData(eventId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventLive/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok: ${errorData.message}`);
        }
        const data = await response.json();
        if (data.success) {
            const recentReports = Array.isArray(data.recentReports) ? data.recentReports : [];
            addDescriptionElements(recentReports);
        } else {
            console.error('Failed to fetch events:', data.message);
            alert(data.message || 'Failed to fetch events');
        }
    } catch (error) {
        console.error('Error fetching live reports:', error.message);
        alert(`An error occurred while fetching live reports: ${error.message}. Please try again later.`);
    }
}
function addDescriptionElements(recentReports) {
    recentReports.forEach((report, index) => {
        const reportContainer = document.getElementById(`report${index + 1}`);
        if (reportContainer) {
            const descriptionSpan = reportContainer.querySelector('.description');
            if (descriptionSpan) {
                descriptionSpan.textContent = report.update_description;
            }
            const timeSpan = reportContainer.querySelector('.time');
            if (timeSpan) {
                try {
                    const [hours, minutes] = report.time.split(':');
                    const formattedTime = `${hours}:${minutes}`;
                    timeSpan.textContent = formattedTime;
                } catch (error) {
                    console.error(`Error formatting time for report ${index + 1}:`, error);
                    timeSpan.textContent = 'Invalid time';
                }
            }
        } else {
            console.error(`Report container with ID report${index + 1} not found`);
        }
    });
}
function setupButtonListener(eventData, user_id) {
    const declineButton = document.querySelector('.declineButton');
    const buttonContainer = document.querySelector('.buttonContainer');
    const buttonAccept = document.querySelector('.acceptButton');
    if (!declineButton || !buttonContainer || !buttonAccept) {
        console.error('Required elements not found in the DOM');
        return;
    }
    declineButton.addEventListener('click', async function () {
        try {
            const response = await fetch('https://proj-2-ffwz.onrender.com/api/eventLive/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: user_id, place: null })
            });
            const result = await response.json();
            if (response.ok) {
                window.location.href = 'userHomePage.html';
            } else {
                console.error('Error updating user place:', result.message);
                alert('Error updating user place: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating user place: ' + error.message);
        }
    });
    buttonAccept.addEventListener('click', async function () {
        const userId = user_id;
        const eventId = eventData.event_id;
        const place = eventData.place;
        const eventName = eventData.event_name;
        const date = eventData.date;
        const time = eventData.time;
        const status = eventData.status;
        const map = eventData.map;
        const eventType = eventData.event_type;
        const maxHelper = eventData.max_helper;
        if (!userId || !eventId || !place) {
            console.error('User ID, Event ID, or place is missing');
            return;
        }
        const requestData = {
            user_id: userId,
            event_id: eventId,
            place: place,
            event_name: eventName,
            date: date,
            time: time,
            status: status,
            map: map,
            event_type: eventType,
            max_helper: maxHelper
        };
        try {
            const response = await fetch('https://proj-2-ffwz.onrender.com/api/eventLive/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const result = await response.json();
            if (response.ok) {
                const queryParams = new URLSearchParams({
                    eventName: eventName,
                    eventType: eventType,
                    eventDate: date,
                    eventId: eventId,
                    eventAddress: place,
                    eventStatus: status
                }).toString();
                window.location.href = `mapPage.html?${queryParams}`;
            } else {
                console.error('Error inserting data:', result.message);
                alert('Error inserting data: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while inserting data: ' + error.message);
        }
    });
}
function createMapButton(eventData, user_id) {
    const buttonContainer = document.querySelector('.buttonContainer');
    const existingMapButton = document.querySelector('.mapButton');
    if (existingMapButton) {
        return;
    }
    buttonContainer.innerHTML = '';
    const mapButton = document.createElement('button');
    mapButton.textContent = 'View Map';
    mapButton.className = 'mapButton';
    buttonContainer.appendChild(mapButton);
    mapButton.addEventListener('click', () => {
        const queryParams = new URLSearchParams({
            eventName: eventData.event_name,
            eventType: eventData.event_type,
            eventDate: eventData.date,
            eventId: eventData.event_id,
            eventAddress: eventData.place,
            eventStatus: eventData.status
        }).toString();
        window.location.href = `mapPage.html?${queryParams}`;
    });
}
async function fetchUserEventsDetails(userId) {
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
        const events = result.data;

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
    const threeSentencesContainer = document.getElementById('threeSentences');
    if (!threeSentencesContainer) {
        console.error('threeSentences element not found');
        return;
    }
    threeSentencesContainer.innerHTML = '';
    if (events.length === 0) {
        return;
    }
    const event = events[0];
    const sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'firstSentence';
    const eventTypeSpan = document.createElement('span');
    eventTypeSpan.className = 'detailItem';
    eventTypeSpan.textContent = event.event_name;
    const statusSpan = document.createElement('span');
    statusSpan.className = 'detailItem';
    statusSpan.textContent = event.event_status;
    const descriptionSpan = document.createElement('span');
    descriptionSpan.className = 'detailItem';
    descriptionSpan.textContent = event.address;
    sentenceDiv.appendChild(eventTypeSpan);
    sentenceDiv.appendChild(statusSpan);
    sentenceDiv.appendChild(descriptionSpan);
    threeSentencesContainer.appendChild(sentenceDiv);
}
