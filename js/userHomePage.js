let chartInstance = null;
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
    fetchEventStats('all');
    getEventsType();
    getAllUserNotification();
    fetchUserEventsDetails(userDetails.user_id);
    document.getElementById('calcGraf').addEventListener('click', async () => {
        const eventType = document.getElementById('eventTypeUser').value;

        await fetchEventStats(eventType);
    });
};
async function getAllUserNotification() {
    const userNotification = document.getElementById('notification');

    if (!userNotification) {
        console.error('One or more elements not found in the DOM.');
        return;
    }
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
            userNotification.innerHTML = '';
            const ul = document.createElement('ul');
            ul.classList.add('eventNotificationUsr');
            result.eventNotification.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = notification.notfication;
                li.classList.add('eventItemNotificationUsr');
                ul.appendChild(li);
            });

            userNotification.appendChild(ul);
        } else {
            alert(result.message || 'Load details failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading details.');
    }
}
async function fetchEventStats(eventType) {
    const url = new URL('https://proj-2-ffwz.onrender.com/api/eventHistory/eventStats');
    const params = new URLSearchParams();
    if (eventType === 'all') {
        params.append('date_and_time', '');
    } else {
        params.append('eventType', eventType);
    }
    url.search = params.toString();

    try {
        const response = await fetch(url);
        console.log('URL:', url.toString());
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const result = await response.json();
        console.log('Response from server:', result);
        if (result.success) {
            createChart(result.data);
        } else {
            console.error('Error in response:', result.message);
        }
    } catch (error) {
        console.error('Error fetching event stats:', error);
    }
}
function createChart(data) {
    if (!data) {
        console.log('No data received for chart');
        return;
    }
    const ctx = document.getElementById('eventStatsChart').getContext('2d');
    const labels = [];
    const counts = [];
    const dataMap = new Map();
    data.forEach(item => {
        dataMap.set(item.month, parseInt(item.event_count, 10));
    });
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const monthLabel = currentDate.toISOString().slice(0, 7);
        labels.push(monthLabel);
        counts.push(dataMap.get(monthLabel) || 0);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Event Count',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                tension: 0.1,
                fill: true,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Event Count'
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}
async function getEventsType() {
    const eventType = document.getElementById('eventTypeUser');
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
        if (result.success) {
            eventType.innerHTML = '';
            const allEventsOption = document.createElement('option');
            allEventsOption.classList.add('eventOption');
            allEventsOption.value = 'all';
            allEventsOption.text = 'All Events';
            eventType.appendChild(allEventsOption);
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
