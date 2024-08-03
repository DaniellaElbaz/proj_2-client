window.onload = async () => {
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
        const firstName = userDetails.first_name;
        const lastName = userDetails.last_name;
        const urlParams = new URLSearchParams(window.location.search);
        const eventName = urlParams.get('eventName');
        const eventType = urlParams.get('eventType');
        const eventDate = urlParams.get('eventDate');
        const eventAddress = urlParams.get('eventAddress');
        const eventStatus = urlParams.get('eventStatus');
        const eventId = urlParams.get('eventId');
        if (eventName && document.getElementById('eventName')) {
            document.getElementById('eventName').innerText = `דו''ח אירוע: ${eventName}`;
        }
        const selectTypeElement = document.getElementById('selectType');
        if (selectTypeElement) {
            selectTypeElement.innerHTML = ''; // Clear any existing options
            const option = document.createElement('option');
            option.value = eventType;
            option.text = eventType;
            option.selected = true; // Set the option as selected
            selectTypeElement.appendChild(option);
        }
        if (eventDate && document.getElementById('inputDate')) {
            document.getElementById('inputDate').value = eventDate.split('T')[0];
        }
        if (firstName && lastName && document.getElementById('userName')) {
            document.getElementById('userName').value = `${firstName} ${lastName}`;
        }
        if (eventAddress && document.querySelector('h2')) {
            document.querySelector('h2').innerText += eventAddress;
        }
        if (eventId) {
            await fetchAndPopulateUsers(eventId);
            inputToTextBox();
            populateStaticOptions();
        }
        const beckButton = document.querySelector('.button-back-report');
        if (beckButton) {
            beckButton.addEventListener('click', buttonBeck);
        }
        const submitButton = document.querySelector('.button-send-report');
        if (submitButton) {
            submitButton.addEventListener('click', handleSubmitReport);
        }
    } else {
    }
};
function buttonBeck(){
    const userConfirmed = confirm(" הזהרה! ביציאה מהדף הדו''ח לא ישמר");
    if (userConfirmed) {
        window.location.href = "eventList.html"
    }
}
async function fetchAndPopulateUsers(eventId) {
    try {
        const response = await fetch(`https://proj-2-ffwz.onrender.com/api/user/?eventId=${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            populateUserSelectBoxes(result.data);
        } else {
            console.error('No users found or invalid data format');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
function populateUserSelectBoxes(users) {
    const helpInput = document.querySelector('.help-input');
    const helpSelected = document.querySelector('.help-selected');
    if (helpInput) {
        const currentUserId = JSON.parse(localStorage.getItem('userDetails')).user_id;
        const noOption = document.createElement('option');
        const currentUser = users.find(user => user.user_id === currentUserId);
        if (currentUser) {
            noOption.value = 'לא';
            noOption.text = 'לא';
            noOption.selected = true;
        }
        helpInput.insertBefore(noOption, helpInput.firstChild);
        users.forEach(user => {
            if (user.user_id !== currentUserId) {
                const userOption = document.createElement('option');
                userOption.value = `${user.first_name} ${user.last_name}`;
                userOption.text = `${user.first_name} ${user.last_name}`;
                helpInput.appendChild(userOption);
            }
        });
        helpInput.addEventListener('change', () => {
            if (helpInput.value === 'לא') {
                helpSelected.disabled = true;
            } else {
                helpSelected.disabled = false;
            }
        });
        if (helpInput.value === 'לא') {
            helpSelected.disabled = true;
        }
    } else {
        console.error('Select element with class "help-input" not found');
    }
}
function populateStaticOptions() {
    const helpSelected = document.querySelector('.help-selected');
    const options = [
        { value: " ", text: " " },
        { value: "נהג בנחישות ועזר לכולם", text: "נהג בנחישות ועזר לכולם" },
        { value: "הציל חיים רבים", text: "הציל חיים רבים" },
        { value: "דאג לעדכן את כוחות המשטרה וכוחות הביטחון", text: "דאג לעדכן את כוחות המשטרה וכוחות הביטחון" }
    ];
    if (helpSelected) {
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.text = opt.text;
            helpSelected.appendChild(option);
        });
    }
}
function inputToTextBox() {
    const textWhen = document.getElementById("textareaWhen");
    const textExplain = document.getElementById("textareaExplain");
    createCharCountElement(textWhen, "whenCharCount");
    createCharCountElement(textExplain, "explainCharCount");
    textWhen.addEventListener('input', () => updateCharCount(textWhen, "whenCharCount"));
    textExplain.addEventListener('input', () => updateCharCount(textExplain, "explainCharCount"));
    updateCharCount(textWhen, "whenCharCount");
    updateCharCount(textExplain, "explainCharCount");
}

function createCharCountElement(textarea, placeholderId) {
    if (!textarea) return;
    let existingCountElement = document.getElementById(placeholderId);
    if (existingCountElement) return;
    let textareaContainer = textarea.parentElement;
    const charCountElement = document.createElement('div');
    charCountElement.classList.add('textarea-placeholder');
    charCountElement.id = placeholderId;
    charCountElement.textContent = `0/${textarea.maxLength} מילים`;
    textareaContainer.appendChild(charCountElement);
}
function updateCharCount(textarea, placeholderId) {
    const usedChars = textarea.value.length;
    const maxChars = textarea.maxLength;
    const placeholderElement = document.getElementById(placeholderId);
    if (placeholderElement) {
        placeholderElement.textContent = `${usedChars}/${maxChars}`;
    }
}
async function handleSubmitReport() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    const eventWhen = document.getElementById("textareaWhen").value.trim();
    const eventExplain = document.getElementById("textareaExplain").value.trim();
    const userRegretsId = userDetails.user_id;
    const userRegrets = document.querySelector('.help-selected').value.trim();
    if (!eventWhen) {
        alert('נא למלא את שדה "מתי זה קרה".');
        return;
    }
    if (!eventExplain) {
        alert('נא למלא את שדה "תיאור האירוע".');
        return;
    }
    const requestData = {
        userId: userDetails.user_id,
        eventId: eventId,
        eventWhen: eventWhen,
        eventExplain: eventExplain,
        userRegretsId: userRegretsId,
        userRegrets: userRegrets
    };
    try {
        const response = await fetch('https://proj-2-ffwz.onrender.com/api/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Report submitted successfully');
            window.location.href = 'eventList.html';
        } else {
            console.error('Error submitting report:', result.message);
            alert('Error submitting report: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting report: ' + error.message);
    }
}
