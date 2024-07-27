let openRegrets=false;
function initBottomReport(form) {
    form.name = 'reportForm';
    form.method = "post";
    const buttonSend = document.createElement('input');
    buttonSend.type = "button";
    buttonSend.value = "הגשת דוח";
    form.appendChild(buttonSend);
    buttonSend.classList.add('button-send-report');
    buttonSend.onclick = function () {
        validateForm();
    }
}
function validateForm() {
    let whenText = document.getElementById('textareaWhen').value;
    if (whenText.trim() === "") {
        alert("חייב למלא איך ומתי שמעת שהאירוע התרחש");
        return false;
    }

    let explainText = document.getElementById('textareaExplain').value;
    if (explainText.trim() === "") {
        alert("חייב למלא איך פעלת באירוע");
        return false;
    }
    let eventNameRequest = `GET http://127.0.0.1:5500/eventList.html?eventId=123&eventWhen=${encodeURIComponent(whenText)}`;
    console.info(`Request for Event Name and Time: ${eventNameRequest}`);

    let eventPlaceRequest = `GET http://127.0.0.1:5500/eventList.html?eventExplain=${encodeURIComponent(explainText)}`;
    console.info(`Request for Event Explanation and Type: ${eventPlaceRequest}`);
    alert("הדוח נשלח בהצלחה!");
    window.location.href = "eventList.html";
}
function newEventCheck() {
    let eventNameInput = document.getElementById('textareaWhenE').value;
    if (eventNameInput.trim() === "") {
        alert("חייב למלא מתי ואיפה האירוע  ");
        return false;
    }
    else{
        let eventNameRequest = `GET http://127.0.0.1:5500/eventList.html?eventId=123&eventWhen=${encodeURIComponent(eventNameInput)}`;
        console.info(`מיקום וזמן האירוע  ${eventNameRequest}`);
    }
    let eventExplain = document.getElementById('textareaExplainE').value;
    if (eventExplain.trim() === "") {
        alert("חייב להסביר על האירוע");
        return false;
    }
    else{
        let eventExplainRequest = `GET http://127.0.0.1:5500/eventList.html?eventId=123&eventexplain=${encodeURIComponent(eventExplain)}`;
        console.info(`פרטי האירוע  ${eventExplainRequest}`);
    }
    let type = document.getElementById('NewSelectType').value;
    if (type.trim() === "") {
        alert("חייב למלא סוג אירוע");
        return false;
    }
    else{
        let eventTypeRequest = `GET http://127.0.0.1:5500/eventList.html?eventId=123&eventtype=${encodeURIComponent(type)}`;
          console.info(`סוג האירוע  ${eventTypeRequest}`);
    }
    const userConfirmed = confirm("האם אתה בטוח שתרצה לדווח?");
    if (userConfirmed) {
        alert("הדוח נשלח בהצלחה!");
        window.location.href = "eventList.html";
    } else {
        return false;
    }
}
function buttonBeck(){
    const userConfirmed = confirm(" הזהרה! ביציאה מהדף הדו''ח לא ישמר");
    if (userConfirmed) {
        window.location.href = "eventList.html"
    }
}
function buttonAdd(){
    const userConfirmed = confirm(" הזהרה! ביציאה מהדף הדו''ח לא ישמר");
    if (userConfirmed) {
        window.location.href = "eventList.html";
    }
}
function showMembersEvent(data) {
    const selectionEventId = getEventId();
    const userName = 'נועה לוינסון';
    let inputRegretsContainer = document.createElement('div');
    inputRegretsContainer.classList.add('inputregretsContainer');
    let inputName = document.createElement('div');
    inputName.classList.add('members-input');
    const eventMembers = document.createElement('select');
    eventMembers.classList.add('help-selected');
    for (const member of data.members) {
        if (member.name == userName) {
            const option = document.createElement('option');
            option.value = "לא";
            option.text = "לא";
            option.selected = true;
            eventMembers.appendChild(option);
        }
        else{
            for (const event of member.events) {
                if (event.id == selectionEventId) {
                    const option = document.createElement('option');
                    option.value = member.name;
                    option.text = member.name;
                    eventMembers.appendChild(option);
                }
            }
        }
    }
    let inputDetails = document.createElement('div');
    inputDetails.classList.add('help-input');
    eventMembers.addEventListener('change', function() {
        openRegrets = isValueSelectedNotNo(eventMembers);

        inputDetails.innerHTML="";
        initMembersBox(inputDetails);
    });
    inputName.appendChild(eventMembers);
    const names = document.createElement('p');
    names.textContent = "אדם שתרצה/י לשבח בפועלו";
    inputName.appendChild(names);
    inputRegretsContainer.appendChild(inputName);
    inputRegretsContainer.appendChild(initMembersBox(inputDetails));
    return inputRegretsContainer;
}
function isValueSelectedNotNo(selectElement) {
    return selectElement.value !== "לא";
}
function initMembersBox(inputDetails) {
    const names = document.createElement('p');
    names.textContent = "?איך היא/הוא תרם/ה לאירוע";
    const eventRegrets = document.createElement('select');
    const options = [
        { value: " ", text: " " },
        { value: "נהג בנחישות ועזר לכולם", text: "נהג בנחישות ועזר לכולם" },
        { value: "הציל חיים רבים", text: "הציל חיים רבים" },
        { value: "דאג לעדכן את כוחות המשטרה וכוחות הביטחון", text: "דאג לעדכן את כוחות המשטרה וכוחות הביטחון" }
    ];
    for (const opt of options) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.text = opt.text;
        eventRegrets.appendChild(option);
    }
    if (openRegrets) {
        eventRegrets.disabled = false;
    } else {
        eventRegrets.disabled = true;
    }
    inputDetails.appendChild(names);
    inputDetails.appendChild(eventRegrets);
    return inputDetails;
}
function buttonSend() {
    const createEvent = document.createElement('button');
    createEvent.classList.add('newEvent');
    createEvent.innerText = "שלח אירוע";
    createEvent.type = "button";
    createEvent.onclick = function () {
        const isFormValid = newEventCheck();
        if (!isFormValid) {
            event.preventDefault();
        }
    };
    return createEvent;
}
function buttonExit(){
    const out = document.createElement('button');
    out.classList.add('exitEvent');
    out.onclick = function () {
        const userConfirmed = confirm(" האם אתה בטוח שתרצה לצאת מהדיווח?");
            if (userConfirmed) {
                window.location.href = "eventList.html";
            }
    };
   return out;
}
function whenCount(textWhen) {
    let textareaContainerWhen = document.createElement('div');
    textareaContainerWhen.classList.add('textarea-container');
    textareaContainerWhen.appendChild(textWhen);
    const whenCharCount = document.createElement('div');
    whenCharCount.classList.add('textarea-placeholder');
    whenCharCount.id = "whenCharCount";
    whenCharCount.textContent = `0/${textWhen.maxLength} מילים`;
    textareaContainerWhen.appendChild(whenCharCount);
    return textareaContainerWhen;
}
function explainCount(textExplain) {
    let textareaContainerExplain = document.createElement('div');
    textareaContainerExplain.classList.add('textarea-container');
    textareaContainerExplain.appendChild(textExplain);
    const explainCharCount = document.createElement('div');
    explainCharCount.classList.add('textarea-placeholder');
    explainCharCount.id = "explainCharCount";
    explainCharCount.textContent = `0/${textExplain.maxLength} מילים`;
    textareaContainerExplain.appendChild(explainCharCount);
    return textareaContainerExplain;
}
function updateCharCount(textarea, placeholderId) {
    const usedChars = textarea.value.length;
    const maxChars = textarea.maxLength;
    const placeholderElement = document.getElementById(placeholderId);
    placeholderElement.textContent = `${usedChars}/${maxChars}`;
}