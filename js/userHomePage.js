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
    const monthInput = document.getElementById('month');
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const formattedMonth = `${startOfYear.getFullYear()}-01`; // Format as YYYY-MM
    monthInput.value = formattedMonth;

    fetchEventStats('', formattedMonth);
    getEventsType();
    getAllUserNotification();
    document.getElementById('calcGraf').addEventListener('click', async () => {
        const eventType = document.getElementById('eventTypeUser').value;
        const month = document.getElementById('month').value;
        await fetchEventStats(eventType, month);
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
async function fetchEventStats(eventType = '', month = '') {
    const url = new URL('https://proj-2-ffwz.onrender.com/api/eventHistory/eventStats');
    const params = new URLSearchParams();
    
    if (eventType) params.append('eventType', eventType);
    if (month) params.append('date_and_time', month);

    url.search = params.toString();

    try {
        const response = await fetch(url);
        console.log('URL:', url.toString()); // Debug URL
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
    if (!data || data.length === 0) {
        console.log('No data received for chart');
        return;
    }
    const ctx = document.getElementById('eventStatsChart').getContext('2d');
    const labels = data.map(item => item.month);
    const counts = data.map(item => item.event_count);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Event Count',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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