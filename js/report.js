let report;
const form = document.createElement("form");
window.onload = () => {
    form.classList.add('manege-necessary-data');
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
    initBottomReport(form);
    initReport(user,data);
}
function initReport(user, data) {
    const report = document.getElementById("report");
    report.innerHTML = '';
    
    const reportItem = document.createElement('div');
    reportItem.classList.add('report-item');
    
    // Append input from JSON to text box
    const items = inputFromJsonToTextBox(user);
    if (items) {
        reportItem.appendChild(items);
    }
    
    // Append selected event details
    const selectedEvent = showSelectedEvent(user);
    if (selectedEvent) {
        reportItem.appendChild(selectedEvent);
    }
    
    // Append separator lines
    const separator1 = document.createElement('p');
    separator1.classList.add('makeABlackLine');
    reportItem.appendChild(separator1);

    const separator2 = document.createElement('p');
    separator2.classList.add('makeABlackLine');
    reportItem.appendChild(separator2);

    // Append form and members
    reportItem.appendChild(inputToTextBox());
    reportItem.appendChild(showMembersEvent(data));
    
    report.appendChild(reportItem);
}
function getEventId() {
    const queryString = window.location.search.substring(1);
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('eventId'); // Assumes 'eventId' is the key for the event ID
}
function showSelectedEvent(user) {
    const selectionEventId = getEventId();
    const eventD = document.createElement('div'); // Changed to 'div' for better structure

    for (const eventKey in user.events) {
        let eventDetails = user.events[eventKey];
        if (eventDetails.id == selectionEventId) {
            // Initialize the select box with event details
            eventD.appendChild(initSelectBox(eventDetails));
            
            // Create participant name input
            const participantName = document.createElement('p');
            participantName.classList.add('inline');
            const nameInput = document.createElement('input');
            nameInput.id = "userName";
            nameInput.placeholder = eventDetails.participant_name || "No participant"; // Ensure placeholder has fallback
            nameInput.disabled = true;
            participantName.appendChild(nameInput);
            participantName.appendChild(document.createTextNode(":שם המשתתף/ת"));
            eventD.appendChild(participantName);
            
            // Add event date and other details
            eventD.appendChild(initDate(eventDetails));
            break;
        }
    }
    
    return eventD;
}

function initDate(eventDetails) {
    const p = document.createElement('p');
    p.classList.add('inline');
    
    // Extract date and time parts
    const dateAndTimeParts = eventDetails.date_and_time.trim().split(" שעה ");
    const eventDate = dateAndTimeParts[0];
    
    // Create input element for date
    const dateInput = document.createElement('input');
    dateInput.id = "inputDate";
    dateInput.placeholder = eventDate;
    dateInput.disabled = true;
    
    // Append elements to paragraph
    p.appendChild(dateInput);
    p.appendChild(document.createTextNode(":תאריך האירוע"));
    
    return p;
}

function initSelectBox(eventDetails) {
    const p = document.createElement('p');
    p.classList.add('inline');
    
    // Create select element for event type
    const typeSelect = document.createElement('select');
    typeSelect.id = "selectType";
    
    const option = document.createElement('option');
    option.value = eventDetails.type_event;
    option.text = eventDetails.type_event;
    option.selected = true;
    
    typeSelect.appendChild(option);
    typeSelect.disabled = true;
    
    // Append elements to paragraph
    p.appendChild(typeSelect);
    p.appendChild(document.createTextNode(":סוג האירוע"));
    
    return p;
}

function inputFromJsonToTextBox(user) {
    const selectionEventId = getEventId();
    let reportItem = document.createElement('div');
    const buttonBackFromReport = document.createElement('input');
    buttonBackFromReport.type = "button";
    buttonBackFromReport.value = "חזרה להיסטורית אירועים";
    buttonBackFromReport.onclick = function () {
        buttonBack();
    };
    buttonBackFromReport.classList.add('button-back-report');
    reportItem.appendChild(buttonBackFromReport);
    let eventFound = false;
    for (const eventKey in user.events) {
        let eventDetails = user.events[eventKey];
        if (eventDetails.id === selectionEventId) {
            eventFound = true;
            const eventName = eventDetails.event_name;
            const eventPlace = eventDetails.event_place;
            const h1 = document.createElement('h1');
            h1.innerText = `דו''ח אירוע ${eventName}`;
            reportItem.appendChild(h1);
            const h2 = document.createElement('h2');
            h2.innerText = `מיקום - ${eventPlace}`;
            reportItem.appendChild(h2);
            break;
        }
    }
    if (!eventFound) {
        const noEventFoundMessage = document.createElement('p');
        noEventFoundMessage.innerText = "אירוע לא נמצא";
        reportItem.appendChild(noEventFoundMessage);
    }

    return reportItem;
}

function inputToTextBox() {
    let inputItem = document.createElement('div');
    inputItem.classList.add('report-input');
    const when = document.createElement('p');
    let star = document.createElement('span');
    star.innerHTML ="*";
    let star2 = document.createElement('span');
    star2.innerHTML ="*";
    when.innerText = "?מתי ואיך שמעת שהאירוע התרחש";
    when.appendChild(star);
    inputItem.appendChild(when);
    const textWhen = document.createElement('textarea');
    textWhen.id = "textareaWhen";
    textWhen.name="whenText";
    textWhen.maxLength = 90;
    form.appendChild(textWhen);
    inputItem.appendChild(whenCount(textWhen));
    const explain = document.createElement('p');
    explain.innerText = "הסבר/י על הדרך פעילות שלך באירוע";
    explain.appendChild(star2);
    inputItem.appendChild(explain);
    const textExplain = document.createElement('textarea');
    textExplain.id = "textareaExplain";
    textExplain.name="explainText";
    textExplain.maxLength = 300;
    form.appendChild(textExplain);
    inputItem.appendChild(explainCount(textExplain));
    textWhen.addEventListener('input', () => updateCharCount(textWhen, "whenCharCount"));
    textExplain.addEventListener('input', () => updateCharCount(textExplain, "explainCharCount"));
    return inputItem;
}