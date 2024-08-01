let openRegrets=false;

function validateForm() {
    let whenText = document.getElementById('textareaWhen').value.trim();
    let explainText = document.getElementById('textareaExplain').value.trim();
    let userId = localStorage.getItem('userId');
    let eventId = getEventId();
    let userRegretsId = localStorage.getItem('userRegretsId');

    if (whenText === "") {
        alert("חייב למלא איך ומתי שמעת שהאירוע התרחש");
        return false;
    }

    if (explainText === "") {
        alert("חייב למלא איך פעלת באירוע");
        return false;
    }
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
    const url = new URL('https://proj-2-ffwz.onrender.com/api/user/');
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

function isValueSelectedNotNo(selectElement) {
    return selectElement.value !== "לא";
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

