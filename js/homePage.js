document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem('userId'); // קבלת userId מ-localStorage

    if (userId) {
        fetchEventData(userId);
    } else {
        console.error('User ID not found.');
        alert('User not logged in. Please log in to view events.');
    }
    setupButtonListener();
});

async function fetchEventData(userId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventLiveReports/${userId}`, {
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
        console.log('Response from server:', data);

        if (data.success) {
            addDescriptionElements(data.eventLiveReports, data.recentReports);
        } else {
            console.error('Failed to fetch events:', data.message);
            alert(data.message || 'Failed to fetch events');
        }
    } catch (error) {
        console.error('Error fetching events:', error.message);
        alert(`An error occurred while fetching events: ${error.message}. Please try again later.`);
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

function setupButtonListener() {
    const declineButton = document.querySelector('.declineButton');
    const buttonContainer = document.querySelector('.buttonContainer');

    declineButton.addEventListener('click', function () {
        // Create the new button
        const newButton = document.createElement('button');
        newButton.textContent = 'אירוע פעיל, באפשרותך להצטרף בכל רגע נתון';
        newButton.className = 'activeEventButton';

        // Add click event to the new button
        newButton.addEventListener('click', function () {
            window.location.href = 'userDetails.html'; // Replace 'userDetails.html' with the actual URL
        });

        // Clear the existing buttons
        buttonContainer.innerHTML = '';

        // Add the new button
        buttonContainer.appendChild(newButton);
    });
}
