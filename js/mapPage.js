window.onload = async () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userImage = localStorage.getItem('userImage');
    const userName = localStorage.getItem('userName');
    const eventData = JSON.parse(localStorage.getItem('eventData'));

    if (userDetails && userImage && userName) {
        const managerImage = document.getElementById('user-image');
        const userNameElement = document.getElementById('user-name');
        if (managerImage) {
            managerImage.src = userImage;
        }
        if (userNameElement) {
            userNameElement.innerText = userName;
        }
        const map = urlParams.get('map');
        if (map && document.getElementById('eventMap')) {
            document.getElementById('eventMap').src = `images/${map}`;
        }
    } else {
        console.log('User details not found in local storage.');
    }
};
