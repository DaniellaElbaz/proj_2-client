window.onload = () => {
    getAllNotification();
};

async function getAllNotification() {
    const dateElement = document.getElementById('dataAndTime');
    const highPossibilityEventsElement = document.getElementById('highPossibilityEvents');
    const mapPointsElement = document.getElementById('mapPoints');

    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/madaHomePage/', {
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
            dateElement.innerHTML = '';
            highPossibilityEventsElement.innerHTML = '';
            mapPointsElement.innerHTML = '';

            result.eventNotification.forEach(notification => {
                const dateDiv = document.createElement('div');
                dateDiv.textContent = `Date: ${new Date(notification.date).toLocaleDateString()}`;
                dateElement.appendChild(dateDiv);

                const eventDiv = document.createElement('div');
                eventDiv.textContent = `Event: ${notification.notfication}`;
                highPossibilityEventsElement.appendChild(eventDiv);

                const mapDiv = document.createElement('div');
                mapDiv.innerHTML = `<img src="${notification.day_map}" alt="Day Map">`;
                mapPointsElement.appendChild(mapDiv);
            });

            console.log('Day details:', { dateElement, highPossibilityEventsElement, mapPointsElement });
        } else {
            alert(result.message || 'Load details failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading details.');
    }
}
