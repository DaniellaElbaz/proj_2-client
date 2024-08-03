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
        if(userDetails.place== null){
            alert("no event");
            window.location.href="userHomePage.html";
        }
        fetchEventData(eventData.event_id);
        fetchUserEventsDetails(userDetails.user_id);
        setupButtonListener(eventData, userDetails.user_id);
    } else {
        console.log('User details or event ID not found in local storage.');
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
        console.log('Live Reports:', data.recentReports);

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
                console.log(`Raw time data for report ${index + 1}: ${report.time}`);
                try {
                    // Assuming report.time is in "HH:MM:SS" format
                    const [hours, minutes] = report.time.split(':');
                    const formattedTime = `${hours}:${minutes}`;
                    timeSpan.textContent = formattedTime;
                    console.log(`Formatted time for report ${index + 1}: ${formattedTime}`);
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
                console.log('User place updated successfully:', result);
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
    
        console.log('Request Data:', requestData);
    
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
                console.log('Data inserted successfully:', result);
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

async function fetchUserEventsDetails(userId) {
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
    const threeSentencesContainer = document.getElementById('threeSentences');

    if (!threeSentencesContainer) {
        console.error('threeSentences element not found');
        return;
    }

    console.log('Populating event details:', events);

    // Clear existing content
    threeSentencesContainer.innerHTML = '';

    if (events.length === 0) {
        console.log('No events found');
        return;
    }

    // Process only the first event
    const event = events[0];
    console.log('Processing event:', event);

    const sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'firstSentence'; // Display only one event, so always use 'firstSentence'

    const eventTypeSpan = document.createElement('span');
    eventTypeSpan.className = 'detailItem';
    eventTypeSpan.textContent = event.event_name; // Assuming 'event_name' is the correct key

    const statusSpan = document.createElement('span');
    statusSpan.className = 'detailItem';
    statusSpan.textContent = event.event_status; // Assuming 'event_status' is the correct key

    const descriptionSpan = document.createElement('span');
    descriptionSpan.className = 'detailItem';
    descriptionSpan.textContent = event.address; // Assuming 'address' is the correct key

    sentenceDiv.appendChild(eventTypeSpan);
    sentenceDiv.appendChild(statusSpan);
    sentenceDiv.appendChild(descriptionSpan);

    threeSentencesContainer.appendChild(sentenceDiv);
    console.log('Added sentenceDiv:', sentenceDiv);
}