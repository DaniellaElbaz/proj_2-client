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
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const formattedMonth = `${oneYearAgo.getFullYear()}-${String(oneYearAgo.getMonth() + 1).padStart(2, '0')}`; // Format as YYYY-MM
    monthInput.value = formattedMonth;

    fetchEventStats('all', formattedMonth);
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

async function fetchEventStats(eventType, month) {
    const url = new URL('https://proj-2-ffwz.onrender.com/api/eventHistory/eventStats');
    const params = new URLSearchParams();

    // אם בחרת באפשרות 'ALL', שלח את התאריך כערך ריק
    if (eventType === 'all') {
        params.append('date_and_time', ''); // קבל את כל הנתונים
    } else {
        params.append('eventType', eventType);
        params.append('date_and_time', month);
    }

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
    if (!data) {
        console.log('No data received for chart');
        return;
    }

    const ctx = document.getElementById('eventStatsChart').getContext('2d');
    
    // Prepare data
    const labels = [];
    const counts = [];
    
    // Create a map to store counts by month
    const dataMap = new Map();
    data.forEach(item => {
        dataMap.set(item.month, parseInt(item.event_count, 10));
    });

    // Determine the range of months to show
    const startDate = new Date(); // Use current date to determine range
    startDate.setFullYear(startDate.getFullYear() - 1); // Look back one year
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // End of the current month
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const monthLabel = currentDate.toISOString().slice(0, 7); // Format as YYYY-MM
        labels.push(monthLabel);
        counts.push(dataMap.get(monthLabel) || 0); // Default to 0 if no data for this month
        currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
    }

    console.log('Labels:', labels);
    console.log('Counts:', counts);

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
                    type: 'category', // Use 'category' scale for simple labels
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
                        stepSize: 1 // Ensure the y-axis increments by 1
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

        console.log('Response from server:', result);

        if (result.success) {
            eventType.innerHTML = '';

            // Add default option for all events
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
