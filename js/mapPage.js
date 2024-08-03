window.onload = async () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userImage = localStorage.getItem('userImage');
    const userName = localStorage.getItem('userName');
    const urlParams = new URLSearchParams(window.location.search);
    if (userDetails && userImage && userName) {
        const managerImage = document.getElementById('user-image');
        const userNameElement = document.getElementById('user-name');
        if (managerImage) {
            managerImage.src = userImage;
        }
        if (userNameElement) {
            userNameElement.innerText = userName;
        }
        const eventAddress = urlParams.get('eventAddress');
        if (eventAddress) {
            const location = await getCoordinatesFromAddress(eventAddress);
            if (location) {
                initMap(location);
            } else {
                console.error('Failed to get coordinates for the address');
            }
        } else {
            console.error('Event address not provided');
        }
    } else {
    }
};
async function getCoordinatesFromAddress(address) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat: parseFloat(lat), lng: parseFloat(lon) };
        } else {
            console.error('No results found for the address');
            return null;
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}
function initMap(location) {
    const map = L.map('map').setView([location.lat, location.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([location.lat, location.lng]).addTo(map)
        .bindPopup('Event Location')
        .openPopup();
}
