let report;
const form = document.createElement("form");
window.onload = () => {
    form.classList.add('manege-necessary-data');
    fetch("data/Events.json")
    .then(response => response.json())
    .then(data => initMemberDetails(data));
    initBottomReport(form);
}
function initMemberDetails(data) {
    const userName = 'נועה לוינסון';
    let user_photo;
    let user;
    for (const memberKey in data.members) {
        user = data.members[memberKey];
        if (user.name == userName) {
            user_photo = user.user_photo;
            break;
        }
    }
    const userDetails = document.getElementById("UserImage");
    const photo = document.createElement('img');
    photo.src = user_photo;
    photo.alt = "user_photo";
    photo.title = "user_photo";
    userDetails.appendChild(photo);
    initReport(user,data);
}
function initReport(user,data) {
    report = document.getElementById("report");
    report.innerHTML = '';
    const reportItem = document.createElement('div');
    reportItem.classList.add('report-item');
    const items = inputFromJsonToTextBox(user);
    if (items) {
        reportItem.appendChild(items);
    }
    const selectedEvent = showSelectedEvent(user);
    if (selectedEvent) {
        reportItem.appendChild(selectedEvent);
    }
    let img = document.createElement('p');
    img.classList.add('makeABlackLine');
    reportItem.appendChild(img);
    report.appendChild(reportItem);
    reportItem.appendChild(inputToTextBox());
    report.appendChild(reportItem);
    let img2 = document.createElement('p');
    img2.classList.add('makeABlackLine');
    reportItem.appendChild(img2);
    report.appendChild(reportItem);
    reportItem.appendChild(showMembersEvent(data));
    report.appendChild(reportItem);
    report.appendChild(form);
}
function getEventId() {
    const aKeyValue = window.location.search.substring(1).split('&');
    const eventId = aKeyValue[0].split("=")[1];
    return eventId;
}
function showSelectedEvent(user) {
    const selectionEventId = getEventId();
    const name = 'נועה לוינסון';
    const eventD = document.createElement('p');
    for (const eventKey in user.events) {
        let evenDetails = user.events[eventKey];
        if (evenDetails.id == selectionEventId) {
            eventD.appendChild(initSelectBox(evenDetails));
            const p2 = document.createElement('p');
            p2.classList.add('inline');
            const nameI = document.createElement('input');
            nameI.id = "userName";
            nameI.placeholder = name;
            nameI.disabled = true;
            p2.appendChild(nameI);
            p2.appendChild(document.createTextNode(":שם המשתתף/ת"));
            eventD.appendChild(p2);
            eventD.appendChild(initDate(evenDetails));
            break;
        }
    }
    return eventD;
}
function initDate(evenDetails){
    let eventDate;
    const p = document.createElement('p');
    p.classList.add('inline');
    const dateAndTimeParts = evenDetails.date_and_time.trim().split(" שעה ");
    eventDate = dateAndTimeParts[0];
    const date = document.createElement('input');
    date.id = "inputDate";
    date.placeholder = eventDate;
    date.disabled = true;
    p.appendChild(date);
    p.appendChild(document.createTextNode(":תאריך האירוע"));
    return p;
}
function initSelectBox(evenDetails){
    let eventType;
    eventType = evenDetails.type_event;
    const p = document.createElement('p');
    p.classList.add('inline');
    const type = document.createElement('select');
    type.id = "selectType";
    const option = document.createElement('option');
    option.value = eventType;
    option.text = eventType;
    option.selected = true;
    type.disabled = true;
    type.appendChild(option);
    p.appendChild(type);
    p.appendChild(document.createTextNode(":סוג האירוע"));
    return p;
}
function inputFromJsonToTextBox(user) {
    const selectionEventId = getEventId();
    let reportItem = document.createElement('div');
    let eventName;
    let eventPlace;
    const buttonBeckFromReport = document.createElement('input');
    buttonBeckFromReport.type = "button";
    buttonBeckFromReport.value = "חזרה להיסטורית אירועים";
    buttonBeckFromReport.onclick = function () {
        buttonBeck();
    };
    buttonBeckFromReport.classList.add('button-beck-report');
    reportItem.appendChild(buttonBeckFromReport);
    for (const eventKey in user.events) {
        let evenDetails = user.events[eventKey];
        if (evenDetails.id == selectionEventId) {
            eventName = evenDetails.event_name;
            const h1 = document.createElement('h1');
            h1.innerText = "דו''ח אירוע " + eventName;
            reportItem.appendChild(h1);
            eventPlace = evenDetails.event_place;
            const h2 = document.createElement('h1');
            h2.innerText = "מיקום - " + eventPlace;
            reportItem.appendChild(h2);
            break;
        }
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