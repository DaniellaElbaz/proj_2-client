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
    let whenText = document.getElementById('textareaWhen').value.trim();
    let explainText = document.getElementById('textareaExplain').value.trim();
    let userId =t /* retrieve the user ID from your application context */;
    let eventId =b /* retrieve the event ID from your application context */;
    let userRegretsId =f /* retrieve the userRegretsId from your application context if applicable */;

    if (whenText === "") {
        alert("חייב למלא איך ומתי שמעת שהאירוע התרחש");
        return false;
    }

    if (explainText === "") {
        alert("חייב למלא איך פעלת באירוע");
        return false;
    }

    const reportData = {
        eventWhen: whenText,
        eventExplain: explainText,
        userId: userId,
        eventId: eventId,
        userRegretsId: userRegretsId // Include this if needed
    };

    // Replace with your actual API endpoint
    const apiUrl = 'https://proj-2-ffwz.onrender.com/api/report';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("הדוח נשלח בהצלחה!");
            window.location.href = "eventList.html";
        } else {
            alert("שגיאה בשליחת הדוח: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("שגיאה בשליחת הדוח");
    });

    return false; 
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
async function fetchEventUsers(eventId) {
    const url = new URL('https://proj-2-ffwz.onrender.com/api/eventUsers');
    url.searchParams.append('eventId', eventId);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
        const result = await response.json();
        console.log('Response from server:', result);
        if (result.success) {
            showMembersEvent(result.data); // Pass the retrieved data to showMembersEvent
        } else {
            console.error('Error in response:', result.message);
        }
    } catch (error) {
        console.error('Error fetching event users:', error);
    }
}
function showMembersEvent(data) {
    const selectionEventId = getEventId();
    const inputRegretsContainer = document.createElement('div');
    inputRegretsContainer.classList.add('inputregretsContainer');
    
    const inputName = document.createElement('div');
    inputName.classList.add('members-input');
    
    const eventMembers = document.createElement('select');
    eventMembers.classList.add('help-selected');

    // Populate the select element with user names
    for (const member of data) {
        const option = document.createElement('option');
        option.value = member.user_id;
        option.text = `${member.first_name} ${member.last_name}`;
        eventMembers.appendChild(option);
    }

    const inputDetails = document.createElement('div');
    inputDetails.classList.add('help-input');
    
    eventMembers.addEventListener('change', function() {
        inputDetails.innerHTML = "";
        initMembersBox(inputDetails);
    });

    inputName.appendChild(eventMembers);
    const names = document.createElement('p');
    names.textContent = "אדם שתרצה/י לשבח בפועלו";
    inputName.appendChild(names);
    
    inputRegretsContainer.appendChild(inputName);
    inputRegretsContainer.appendChild(inputDetails);
    
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
