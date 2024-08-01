
window.onload = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userImage = localStorage.getItem('userImage');
    const userName = localStorage.getItem('userName');
    const eventData = JSON.parse(localStorage.getItem('eventData'));
    if (userDetails && userImage && userName  && eventData) {
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
        setupButtonListener();
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
    console.log('threeSentences element:', threeSentencesContainer);

    if (!threeSentencesContainer) {
        console.error('threeSentences element not found');
        return;
    }
    threeSentencesContainer.innerHTML = "";
    eventLiveReports.forEach((report, index) => {
        console.log('Adding report:', report);
        const sentenceClass = (index === 1) ? "secondSentence" : "sentence";
        const sentenceDiv = document.createElement("div");
        sentenceDiv.className = sentenceClass;
        const eventDescription = `${report.event_name} - ${report.event_status} - ${report.type_event}`;
        sentenceDiv.textContent = eventDescription;
        threeSentencesContainer.appendChild(sentenceDiv);
        console.log('Added element:', sentenceDiv);
    });
    recentReports.forEach((report, index) => {
        const reportContainer = document.getElementById(`report${index + 1}`);
        if (reportContainer) {
            const descriptionSpan = reportContainer.querySelector('.description');
            if (descriptionSpan) {
                descriptionSpan.textContent = report.update_description;
            }
            const timeSpan = reportContainer.querySelector('.time');
            if (timeSpan) {
                timeSpan.textContent = report.time;
            }
        } else {
            console.error(`Report container with ID report${index + 1} not found`);
        }
    });
}

function setupButtonListener() {
    const declineButton = document.querySelector('.declineButton');
    const buttonContainer = document.querySelector('.buttonContainer');
    declineButton.addEventListener('click', function () {
        const newButton = document.createElement('button');
        newButton.textContent = 'אירוע פעיל, באפשרותך להצטרף בכל רגע נתון';
        newButton.className = 'activeEventButton';
        newButton.addEventListener('click', function () {
            window.location.href = 'userDetails.html';
        });
        buttonContainer.innerHTML = '';
        buttonContainer.appendChild(newButton);
    });
}
