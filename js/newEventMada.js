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
    } else {
        console.log('User details not found in local storage.');
    }
    getEventsType();
    setupCharacterCounters();
    setupFormSubmission();
};

async function getEventsType() {
    const eventType = document.getElementById('eventType');
    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/eventType/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        console.log('Response from server:', result);

        if (result.success) {
            eventType.innerHTML = '';

            result.type.forEach(types => {
                const eventOption = document.createElement('option');
                eventOption.classList.add('eventOption');
                eventOption.value = `${types.name}`;
                eventOption.text = `${types.name}`;
                eventType.appendChild(eventOption);
            });
        } else {
            alert(result.message || 'Load types failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading types.');
    }
}

function setupCharacterCounters() {
    const inputs = [
        { input: document.getElementById('eventStatus'), counter: document.getElementById('eventStatusCounter') },
        { input: document.getElementById('eventName'), counter: document.getElementById('eventNameCounter') },
        { input: document.getElementById('eventPlace'), counter: document.getElementById('eventPlaceCounter') }
    ];

    inputs.forEach(({ input, counter }) => {
        input.addEventListener('input', () => {
            const length = input.value.length;
            counter.textContent = `${length}/45`;
        });
    });
}

function setupFormSubmission() {
    const formButton = document.getElementById('addEventFormButton');
    formButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Button clicked');  
        const inputs = document.querySelectorAll('#addEventForm input[required]');
        let allFilled = true;
        let emptyFields = [];

        inputs.forEach(input => {
            console.log(`Checking field: ${input.id}, value: "${input.value.trim()}"`);  
            if (!input.value.trim()) {
                allFilled = false;
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    emptyFields.push(label.innerText);
                } else {
                    emptyFields.push(input.id);
                }
            }
        });

        if (allFilled) {
            alert('פרטי האירוע הוזנו בהצלחה');
        } else {
            alert(`נא למלא את השדות הבאים: ${emptyFields.join(', ')}`);
        }
    });
}
