
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
        
        fetchEventData(eventData.event_id);
        setupButtonListener(eventData, userDetails.user_id);
        fetchUserEvents(userDetails.userId);
    } else {
        console.log('User details or event ID not found in local storage.');
    }
};

async function fetchEventData(eventId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventLive/`, {
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
            const eventLiveReports = Array.isArray(data.eventLiveReports) ? data.eventLiveReports : [];
            const recentReports = Array.isArray(data.recentReports) ? data.recentReports : [];
            addDescriptionElements(eventLiveReports, recentReports);
        } else {
            console.error('Failed to fetch events:', data.message);
            alert(data.message || 'Failed to fetch events');
        }
    } catch (error) {
        console.error('Error fetching live reports:', error.message);
        alert(`An error occurred while fetching live reports: ${error.message}. Please try again later.`);
    }
}

function addDescriptionElements(eventLiveReports, recentReports) {
    const threeSentencesContainer = document.getElementById("threeSentences");
    console.log('threeSentences element:', threeSentencesContainer); // Log the element
    if (!threeSentencesContainer) {
        console.error('threeSentences element not found');
        return;
    }

    threeSentencesContainer.innerHTML = ""; // Clear existing content

    eventLiveReports.forEach((report, index) => {
        console.log('Adding report:', report); // Log the report being added
        const sentenceClass = (index === 1) ? "secondSentence" : "sentence";
        const sentenceDiv = document.createElement("div");
        sentenceDiv.className = sentenceClass;
        
        // Adding hyphens to distinguish between elements
        const eventDescription = `${report.event_name} - ${report.event_status} - ${report.type_event}`;
        
        sentenceDiv.textContent = eventDescription;
        threeSentencesContainer.appendChild(sentenceDiv);
        console.log('Added element:', sentenceDiv); // Log the added element
    });

    // Adding recent reports to the reportDetailsContainer
    recentReports.forEach((report, index) => {
        const reportContainer = document.getElementById(`report${index + 1}`);
        if (reportContainer) {
            const descriptionSpan = reportContainer.querySelector('.description');
            descriptionSpan.textContent = report.update_description;

            const timeSpan = reportContainer.querySelector('.time');
            timeSpan.textContent = report.time; // להציג את הזמן שמתקבל מהשרת
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

    declineButton.addEventListener('click', function () {
        const newButton = document.createElement('button');
        newButton.textContent = 'אירוע פעיל, באפשרותך להצטרף בכל רגע נתון';
        newButton.className = 'activeEventButton';
        buttonContainer.appendChild(newButton); // Append the new button to the button container
    });

    buttonAccept.addEventListener('click', async function () {
        const userId = user_id;
        const eventId = eventData.event_id;

        console.log('User ID:', userId);
        console.log('Event ID:', eventId);
        
        if (!userId || !eventId) {
            console.error('User ID or Event ID not found in local storage');
            return;
        }

        const requestData = {
            user_id: userId,
            event_id: eventId,
            place: eventData.place // Replace 'yourPlaceValue' with the actual place value
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
                window.location.href = 'userDetails.html';
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
    const threeSentencesContainer = document.getElementById("threeSentences");
    if (!threeSentencesContainer) {
        console.error('threeSentences element not found');
        return;
    }

    const firstSentence = threeSentencesContainer.querySelector('.firstSentence');
    const secondSentence = threeSentencesContainer.querySelector('.secondSentence');
    const thirdSentence = threeSentencesContainer.querySelector('.thirdSentence');

    // Clear existing content
    firstSentence.innerHTML = "";
    secondSentence.innerHTML = "";
    thirdSentence.innerHTML = "";

    events.slice(0, 3).forEach((event, index) => {
        const eventDetail = `
            <span>${event.event_type}</span>
            <span>${event.status}</span>
            <span>${event.description}</span>
        `;
        if (index === 0) {
            firstSentence.innerHTML = eventDetail;
        } else if (index === 1) {
            secondSentence.innerHTML = eventDetail;
        } else if (index === 2) {
            thirdSentence.innerHTML = eventDetail;
        }
    });
}


