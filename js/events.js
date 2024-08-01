let eventErea;
const sortContainer = document.getElementById('sort-container');

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

        // Fetch userId from userDetails
        const userId = userDetails.user_id; // Adjust based on actual property name
        if (userId) {
            fetchUserEvents(userId);
        } else {
            console.error('User ID not found in userDetails.');
        }
    } else {
        console.log('User details not found in local storage.');
    }

    fillSortContainer();
    eventErea = document.getElementById("events-container");
};

async function fetchUserEvents(userId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/eventHistory/?userId=${userId}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            displayEvents(result.data);
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error fetching user events:', error);
    }
}
function displayEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear any existing content

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');
        eventElement.innerHTML = `
            <h3>${event.event_name}</h3>
            <p>${event.address}</p>
            <p>${event.date_and_time}</p>
            <img src="${event.event_photo}" alt="${event.event_name}" />
            <p>Status: ${event.event_status}</p>
            <p>Type: ${event.type_event}</p>
            <a href="${event.map}" target="_blank">View on Map</a>
        `;
        eventsContainer.appendChild(eventElement);
    });
}
function fillSortContainer() {
    const sort = document.createElement('div');
    sort.classList.add('sort');
    
    const sortInput = document.createElement('input');
    sortInput.placeholder = "חיפוש";
    sortInput.id = "searchInput";
    sort.appendChild(sortInput);

    const sortItem = document.createElement('div');
    sortItem.classList.add('sort-item');

    const clock = document.createElement('img');
    clock.src = "images/clock_down.png";
    clock.alt = "clock";
    clock.title = "clock";
    sortItem.appendChild(clock);

    const filter = document.createElement('img');
    filter.src = "images/un_filter.png";
    filter.alt = "filter";
    filter.title = "filter";
    sortItem.appendChild(filter);

    const box = document.createElement('img');
    box.src = "images/checkbox.png";
    box.alt = "checkbox";
    box.title = "checkbox";
    sortItem.appendChild(box);

    sortContainer.appendChild(sort);
    sortContainer.appendChild(sortItem);
}

async function fetchEventDetails(eventId, userId) {
    const url = new URL('https://proj-2-ffwz.onrender.com/api/eventHistory/');
    url.searchParams.append('eventId', eventId);
    url.searchParams.append('userId', userId);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const result = await response.json();
        console.log('Response from server:', result);

        if (result.success) {
            const eventDetailsContainer = document.getElementById('eventDetailsContainer');
            eventDetailsContainer.innerHTML = '';
            eventDetailsContainer.appendChild(initRectanglesEvenDetails(result.data));
            eventDetailsContainer.appendChild(initBottomRectangles(result.data));
        } else {
            console.error('Error in response:', result.message);
        }
    } catch (error) {
        console.error('Error fetching event details:', error);
    }
}

function initRectanglesEvenDetails(event) {
    const pDetails = document.createElement('p');

    const pDate = document.createElement('p');
    pDate.classList.add('pDate');
    pDate.innerHTML = "תאריך: ";
    const spanDate = document.createElement('span');
    spanDate.classList.add('spanDate');
    spanDate.innerHTML = event.date_and_time ? new Date(event.date_and_time).toLocaleDateString('he-IL') : "N/A";
    pDate.appendChild(spanDate);
    pDetails.appendChild(pDate);

    const pPlace = document.createElement('p');
    pPlace.classList.add('pPlace');
    pPlace.innerHTML = "מקום האירוע: ";
    const spanPlace = document.createElement('span');
    spanPlace.classList.add('spanPlace');
    spanPlace.innerHTML = event.address || "N/A";
    pPlace.appendChild(spanPlace);
    pDetails.appendChild(pPlace);

    const pStatus = document.createElement('p');
    pStatus.classList.add('pStatus');
    pStatus.innerHTML = "סטטוס: ";
    const spanStatus = document.createElement('span');
    spanStatus.classList.add('spanStatus');
    spanStatus.innerHTML = event.event_status || "N/A";
    pStatus.appendChild(spanStatus);
    pDetails.appendChild(pStatus);

    return pDetails;
}

function initBottomRectangles(event) {
    const eventLabel = document.createElement('p');
    eventLabel.innerHTML = `:זירת האירוע`;
    const img = document.createElement('img');
    img.src = event.event_photo;
    img.alt = "Event_Place";
    img.title = "Event_Place";

    const eventContainer = document.createElement('div');
    eventContainer.classList.add('event-item-container');
    eventContainer.appendChild(img);
    eventContainer.appendChild(eventLabel);

    const iconEventContainer = document.createElement('div');
    iconEventContainer.classList.add('iconEventContainer');
    iconEventContainer.appendChild(eventContainer);

    return iconEventContainer;
}

function initRectangles(user) {
    eventErea.innerHTML = '';
    
    user.events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.classList.add('events-item');

        const h1 = document.createElement('h1');
        h1.innerText = event.event_name;
        eventItem.appendChild(h1);

        const table = document.createElement('table');
        const tr = document.createElement('tr');

        const td = document.createElement('td');
        td.appendChild(initRectanglesEvenDetails(event));

        if (event.event_map) {
            const td2 = document.createElement('td');
            const map = document.createElement('img');
            map.src = event.event_map;
            map.alt = "Event Map";
            map.title = "Event_Map";
            td2.appendChild(map);
            tr.appendChild(td2);
        }

        tr.appendChild(td);
        table.appendChild(tr);
        eventItem.appendChild(table);

        if (event.event_photo) {
            const eventShow = document.createElement('div');
            eventShow.classList.add('eventShow');

            const button = document.createElement('button');
            button.innerText = 'לחץ כאן';
            button.addEventListener('click', () => {
                window.location.href = `event_report.html?eventId=${event.event_id}`;
            });

            const eventText = document.createElement('p');
            eventText.innerHTML = `:צפיה בדוח אירוע / מילוי דוח אירוע`;

            eventShow.appendChild(button);
            eventShow.appendChild(eventText);
            eventItem.appendChild(eventShow);
            eventItem.appendChild(initBottomRectangles(event));
        }

        eventErea.appendChild(eventItem);
    });
}
