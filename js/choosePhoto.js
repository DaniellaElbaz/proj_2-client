document.addEventListener('DOMContentLoaded', () => {
    fetch("data/noaIdPic.json")
        .then(response => response.json())
        .then(data => {
            addImageSelectionListeners(data);
        })
});
function addImageSelectionListeners(data) {
    const exploreIcon = document.querySelector('.explore-icon');
    if (exploreIcon) {
        exploreIcon.addEventListener('click', () => {
            openImageSelectionModal(data);
        });
    }
}
function openImageSelectionModal(data) {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "custom-modal-overlay";
    const modal = document.createElement("div");
    modal.className = "custom-modal";
    const modalMessage = document.createElement("p");
    modalMessage.textContent = ":בחר/י תמונה";
    modal.appendChild(modalMessage);
    const imagesContainer = document.createElement("div");
    imagesContainer.className = "custom-images-container";
    const name = 'נועה לוינסון';
    for (const member of data.members) {
        if (member.name === name) {
            member.events.forEach(event => {
                const eventImage = document.createElement("img");
                eventImage.src = event.event_photo;
                eventImage.alt = "Event Photo";
                eventImage.className = "custom-event-image-option";
                eventImage.addEventListener('click', () => {
                    selectImage(event.event_photo, modalOverlay);
                });
                imagesContainer.appendChild(eventImage);
            });
            break;
        }
    }
    modal.appendChild(imagesContainer);
    const closeButton = document.createElement("button");
    closeButton.textContent = "סגור";
    closeButton.addEventListener("click", () => {
        document.body.removeChild(modalOverlay);
    });
    modal.appendChild(closeButton);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
}
function selectImage(imageSrc, modalOverlay) {
    const imageContainer = document.querySelector('.empty-img-container img');
    imageContainer.src = imageSrc;
    addCancelSelectionButton(imageContainer, modalOverlay);
    document.body.removeChild(modalOverlay);
}
function addCancelSelectionButton(imageContainer, modalOverlay) {
    const cancelSelectionButton = document.createElement("button");
    cancelSelectionButton.innerHTML = "&#10006;";
    cancelSelectionButton.className = "cancel-selection-button";
    cancelSelectionButton.addEventListener("click", () => {
        imageContainer.src = "images/empty-image.png";
        imageContainer.parentElement.removeChild(cancelSelectionButton);
        document.body.removeChild(modalOverlay);
    });
    imageContainer.parentElement.appendChild(cancelSelectionButton);
}
