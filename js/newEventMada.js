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
                eventOption.value =`${types.name}`;
                eventOption.text =`${types.name}`;
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