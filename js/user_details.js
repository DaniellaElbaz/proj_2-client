window.onload = () => {
    fetch("data/Events.json")
        .then(response => response.json())
        .then(data => {
            initMemberDetails(data);
            if (!window.eventDetailsDrawn) {
                drawEventDetailsInScrollBar(data);
                window.eventDetailsDrawn = true;
            }
        });
    fetch("data/reports.json")
        .then(response => response.json());
    drawUpPart();
    drawScrollPart();
};

function initMemberDetails(data) {
    const name = 'נועה לוינסון';
    let userPhoto;
    let user;
    for (const memberKey in data.members) {
        user = data.members[memberKey];
        if (user.name == name) {
            userPhoto = user.user_photo;
            events = user.events;
            break;
        }
    }
    const userDetails = document.getElementById("UserImage");
    const photo = document.createElement('img');
    photo.src = userPhoto;
    photo.alt = "user_photo";
    photo.title = "user_photo";
    userDetails.appendChild(photo);
}

function drawUpPart() {
    const sectionUp = document.getElementById("up");
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const backToEventMap = document.createElement("a");
    backToEventMap.className = "back-to-eventMap";
    backToEventMap.innerHTML = "<p>לחזרה לדף הבית</p>";
    backToEventMap.href = "index.html";

    const backIcon = document.createElement("img");
    backIcon.className = "back-icon";
    backIcon.src = "images/back.png";
    backIcon.alt = "back_icon";

    backToEventMap.appendChild(backIcon);
    buttonContainer.appendChild(backToEventMap);
    sectionUp.appendChild(buttonContainer);

    const eventPicContainer = document.createElement("div");
    eventPicContainer.className = "eventPic-container";

    const noaImg = document.createElement("img");
    noaImg.className = "noa-event-map";
    noaImg.src = "images/noaNewEvent.png";
    noaImg.alt = "noa-Event-Photo";

    eventPicContainer.appendChild(noaImg);
    sectionUp.appendChild(eventPicContainer);
}

function drawScrollPart() {
    const downSection = document.getElementById("down-part");
    const eventDataContainer = document.createElement("div");
    eventDataContainer.className = "event-data-container";

    const eventIconsGroup = createIconsGroup();
    const textGroup = createTextGroup();

    const userDetailsContainer = document.createElement("div");
    userDetailsContainer.className = "user-details-container";

    const textEventInfo = document.createElement("p");
    textEventInfo.className = "text-event-info";
    textEventInfo.textContent = "פרטי אירוע";

    const textInfo = document.createElement("p");
    textInfo.className = "my-text-info";
    textInfo.textContent = "פרטים אישיים";

    const textGeneralInfo = document.createElement("p");
    textGeneralInfo.className = "text-general-info";
    textGeneralInfo.textContent = "נא הזן תיאור כללי:";

    userDetailsContainer.appendChild(textEventInfo);
    userDetailsContainer.appendChild(textInfo);
    userDetailsContainer.appendChild(textGeneralInfo);

    const editableRectangle = createEditableRectangle();
    const iconsContainer = createIconsContainer();
    const textContainer = createTextContainer();

    const emptyImgContainer = document.createElement("div");
    emptyImgContainer.className = "empty-img-container";

    const emptyImage = document.createElement("img");
    emptyImage.className = "empty-image";
    emptyImage.src = "images/empty-image.png";
    emptyImage.alt = "empty_image";

    emptyImgContainer.appendChild(emptyImage);

    const recContainer = document.createElement("div");
    recContainer.className = "rec-container";

    const greenButtonRec = document.createElement("button");
    greenButtonRec.className = "green-rec";
    greenButtonRec.innerHTML = "<p>שמור שינויים</p>";
    greenButtonRec.addEventListener("click", () => {
        showModal("השינויים נשמרו בהצלחה");
    });

    const redButtonRec = document.createElement("a");
    redButtonRec.className = "red-rec";
    redButtonRec.innerHTML = "<a>בטל שינויים</a>";
    redButtonRec.href = "index.html";

    recContainer.appendChild(greenButtonRec);
    recContainer.appendChild(redButtonRec);

    downSection.appendChild(eventDataContainer);
    downSection.appendChild(eventIconsGroup);
    downSection.appendChild(textGroup);
    downSection.appendChild(userDetailsContainer);
    downSection.appendChild(editableRectangle);
    downSection.appendChild(iconsContainer);
    downSection.appendChild(textContainer);
    downSection.appendChild(emptyImgContainer);
    downSection.appendChild(recContainer);
}

function createEditableRectangle() {
    const container = document.createElement("div");
    container.className = "editable-rectangle-container";
    const editableRectangle = document.createElement("div");
    editableRectangle.contentEditable = true;
    editableRectangle.className = "editable-rectangle rtl-direction";
    const wordCount = document.createElement("div");
    wordCount.className = "word-count";
    wordCount.textContent = "0/31 מילים";
    container.appendChild(editableRectangle);
    container.appendChild(wordCount);
    editableRectangle.addEventListener("input", () => {
        let content = editableRectangle.textContent.trim();
        const words = content.split(/\s+/).filter(word => word.length > 0);
        const wordLimit = 31;
        if (words.length > wordLimit) {
            content = words.slice(0, wordLimit).join(" ");
            editableRectangle.textContent = content;
        }
        wordCount.textContent = `${words.length}/${wordLimit} מילים`;
    });
    editableRectangle.addEventListener("keydown", (event) => {
        let content = editableRectangle.textContent.trim();
        const words = content.split(/\s+/).filter(word => word.length > 0);
        const wordLimit = 31;
        if (event.key !== 'Backspace' && event.key !== 'Delete' && words.length >= wordLimit) {
            event.preventDefault();
        }
    });
    return container;
}
function createIconsContainer() {
    const cameraModifyIcons = document.createElement("div");
    cameraModifyIcons.className = "camera-modify-icons-container";

    const modifyImage = document.createElement("img");
    modifyImage.className = "modify-icon";
    modifyImage.src = "images/modify-icon.png";
    modifyImage.alt = "modify_icon";

    const cameraIcon = document.createElement("img");
    cameraIcon.className = "camera-icon";
    cameraIcon.src = "images/camera-icon.png";
    cameraIcon.alt = "camera_icon";

    const exploreIcon = document.createElement("img");
    exploreIcon.className = "explore-icon";
    exploreIcon.src = "images/add-image.png";
    exploreIcon.alt = "add_image_icon";

    cameraModifyIcons.appendChild(modifyImage);
    cameraModifyIcons.appendChild(cameraIcon);
    cameraModifyIcons.appendChild(exploreIcon);

    return cameraModifyIcons;
}

function createTextContainer() {
    const textContainer = document.createElement("div");
    textContainer.className = "text-container";

    const photoText = document.createElement("p");
    photoText.className = "text-uniqe";
    photoText.textContent = "תמונה לזיהוי:";

    const imgText = document.createElement("p");
    imgText.className = "text-shoot";
    imgText.textContent = "צלם";

    const imgExplore = document.createElement("p");
    imgExplore.className = "text-explore";
    imgExplore.textContent = "עיון";

    textContainer.appendChild(photoText);
    textContainer.appendChild(imgText);
    textContainer.appendChild(imgExplore);

    return textContainer;
}

function drawEventDetailsInScrollBar(data) {
    const scrollSection = document.getElementById("down-part");
    const eventDataContainer = document.createElement("div");
    eventDataContainer.className = "event-text-container";

    const name = 'נועה לוינסון';
    let user;
    for (const memberKey in data.members) {
        user = data.members[memberKey];
        if (user.name == name) {
            const filteredEvents = user.events.filter(event => event.id === "123");
            filteredEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';

                const eventPlace = document.createElement('p');
                eventPlace.textContent = event.event_place;

                const eventName = document.createElement('p');
                eventName.textContent = event.event_name;

                const eventDistance = document.createElement('p');
                eventDistance.textContent = event.distance_event;

                eventElement.appendChild(eventPlace);
                eventElement.appendChild(eventName);
                eventElement.appendChild(eventDistance);

                eventDataContainer.appendChild(eventElement);
            });
            break;
        }
    }
    scrollSection.appendChild(eventDataContainer);
}

function createIconsGroup() {
    const eventIconsGroup = document.createElement("div");
    eventIconsGroup.className = "events-icons-group";

    const locationIcon = document.createElement("img");
    locationIcon.className = "location-icon";
    locationIcon.src = "images/location-icon.png";
    locationIcon.alt = "location_icon";

    const infoIcon = document.createElement("img");
    infoIcon.className = "info-icon";
    infoIcon.src = "images/info-icon.png";
    infoIcon.alt = "info_icon";

    const distanceIcon = document.createElement("img");
    distanceIcon.className = "distance-icon";
    distanceIcon.src = "images/distance-icon.png";
    distanceIcon.alt = "distance_icon";

    eventIconsGroup.appendChild(locationIcon);
    eventIconsGroup.appendChild(infoIcon);
    eventIconsGroup.appendChild(distanceIcon);

    return eventIconsGroup;
}

function createTextGroup() {
    const textGroup = document.createElement("div");
    textGroup.className = "text-group";

    const locationText = document.createElement("p");
    locationText.className = "text-location";
    locationText.textContent = "מקום האירוע-";

    const detailsGeneralText = document.createElement("p");
    detailsGeneralText.className = "text-general";
    detailsGeneralText.textContent = "פרטים כללים-";

    const distanceText = document.createElement("p");
    distanceText.className = "distance-text";
    distanceText.textContent = "מרחק-";

    textGroup.appendChild(locationText);
    textGroup.appendChild(detailsGeneralText);
    textGroup.appendChild(distanceText);

    return textGroup;
}

function showModal(message) {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal";

    const modalMessage = document.createElement("p");
    modalMessage.textContent = message;

    modal.appendChild(modalMessage);

    const closeButton = document.createElement("button");
    closeButton.textContent = "סגור";
    closeButton.addEventListener("click", () => {
        document.body.removeChild(modalOverlay);
        window.location.href = "index.html";
    });

    modal.appendChild(closeButton);
    modalOverlay.appendChild(modal);

    document.body.appendChild(modalOverlay);
}
