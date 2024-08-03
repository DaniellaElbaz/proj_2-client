window.onload = function() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userImage = localStorage.getItem('userImage');
    const userName = localStorage.getItem('userName');
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id'); // השגת ה-eventId מ-URL

    if (userDetails && userImage && userName) {
        const managerImage = document.getElementById('user-image');
        const userNameElement = document.getElementById('user-name');
        if (managerImage) {
            managerImage.src = userImage;
        }
        if (userNameElement) {
            userNameElement.innerText = userName;
        }
    } else {
        console.log('User details not found in local storage.');
    }

    initializeCharCount('.inputBox', '.charCount', 400);
    setupSubmitButton('#addEventupdateFormButton', '.inputBox', '#errorMessage', '#successMessage');

    if (eventId) {
        fetchEventParticipants(eventId);
    } else {
        console.error('Event ID not found in URL');
    }
};

function initializeCharCount(inputSelector, countSelector, maxChars) {
    const inputBox = document.querySelector(inputSelector);
    const charCount = document.querySelector(countSelector);

    inputBox.addEventListener('input', function() {
        updateCharCount(inputBox, charCount, maxChars);
    });

    function updateCharCount(input, counter, max) {
        let currentLength = input.value.length;
        
        if (currentLength > max) {
            input.value = input.value.substring(0, max);
            currentLength = max; 
        }

        counter.textContent = `${currentLength}/${max}`;
    }
}

function setupSubmitButton(buttonSelector, inputSelector, errorSelector, successSelector) {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    const submitBtn = document.querySelector(buttonSelector);
    const inputBox = document.querySelector(inputSelector);
    const errorMessage = document.querySelector(errorSelector);
    const successMessage = document.querySelector(successSelector);
    const closeErrorBtn = errorMessage.querySelector('.closeBtn');
    const closeSuccessBtn = successMessage.querySelector('.closeBtnSuccess');

    submitBtn.addEventListener('click', function(event) {
        if (inputBox.value.trim() === "") {
            event.preventDefault();
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        } else {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'block';
            const newStatus = inputBox.value.trim(); // Get the status from the input box
            updateReportFromMada(eventId, newStatus);
        }
    });

    closeErrorBtn.addEventListener('click', function() {
        errorMessage.style.display = 'none';
    });

    closeSuccessBtn.addEventListener('click', function() {
        successMessage.style.display = 'none';
        window.location.href = 'liveEventsMDA.html';
    });
}

async function updateReportFromMada(eventId, newStatus) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventType/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus }) // Send the status in the request body
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.success) {
            alert('Event updated successfully');
        } else {
            alert(result.message || 'Failed to update event');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the event.');
    }
}

async function fetchEventParticipants(eventId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventLive/eventParticipants/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }

        const result = await response.json();
        if (result.success) {
            console.log('Participants:', result.data);
            displayParticipants(result.data);
        } else {
            console.error('No participants found:', result.message);
        }
    } catch (error) {
        console.error('Error fetching participants:', error);
    }
}

function displayParticipants(participants) {
    const container = document.querySelector('.eventUserContainer');
    if (!container) {
        console.error('Container element not found');
        return;
    }

    const numberOfUsers = container.querySelector('.numberOfUsers');
    numberOfUsers.textContent += ` ${participants.length}`;

    participants.forEach(participant => {
        const participantDiv = container.querySelector('.participant');

        const img = document.getElementById('participantImage');
        img.src = `images/${participant.user_photo}`;
        img.alt = `${participant.first_name} ${participant.last_name}`;
        const name =document.getElementById('participantName');
        name.textContent = `${participant.first_name} ${participant.last_name}`;

        const phone = document.getElementById('participantPhone');
        phone.textContent = participant.phone;
        

    });
}
