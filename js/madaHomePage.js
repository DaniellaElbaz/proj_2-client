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
    getAllNotification();
    fetchAndDisplayCharts();
};

async function getAllNotification() {
    const dateElement = document.getElementById('dataAndTime');
    const highPossibilityEventsElement = document.getElementById('highPossibilityEvents');
    const eventMapContainer = document.querySelector('.event-map-container');

    if (!dateElement || !highPossibilityEventsElement || !eventMapContainer) {
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
            dateElement.innerHTML = '';
            highPossibilityEventsElement.innerHTML = '';
            eventMapContainer.innerHTML = '';

            const dateDiv = document.createElement('div');
            dateDiv.textContent = `${new Date(result.eventNotification[0].date).toLocaleDateString()}`;
            dateElement.appendChild(dateDiv);

            const mapDiv = document.createElement('div');
            mapDiv.innerHTML = `<img src="images/${result.eventNotification[0].day_map}" alt="Day Map" class="eventMap">`;
            eventMapContainer.appendChild(mapDiv);

            const ul = document.createElement('ul');
            ul.classList.add('eventListMDA');

            result.eventNotification.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = notification.notfication;
                li.classList.add('eventItemMDA');
                ul.appendChild(li);
            });

            highPossibilityEventsElement.appendChild(ul);
        } else {
            alert(result.message || 'Load details failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while loading details.');
    }
}
async function fetchWeatherData() {
    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/weather');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

async function createLineChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.hours,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: data.temperature,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
                {
                    label: 'Humidity (%)',
                    data: data.humidity,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'center',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + ' units';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

async function createUVChart(ctx, data) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.hours,
            datasets: [
                {
                    label: 'UV Index',
                    data: data.uvIndex,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: true,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'center',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + ' units';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

async function fetchAndDisplayCharts() {
    try {
        const weatherData = await fetchWeatherData();
        const weatherCtx = document.getElementById('weatherChart').getContext('2d');
        const uvCtx = document.getElementById('uvChart').getContext('2d');

        await createLineChart(weatherCtx, weatherData);
        await createUVChart(uvCtx, weatherData);
    } catch (error) {
        console.error('Error fetching or displaying charts:', error);
    }
}

