window.onload = () => {
    document.getElementById("text-with-image").addEventListener("click", toggleImage);
    drawFirstPart();
    drawSecondPart();
    drawThirdPart();
};

function drawFirstPart() {
    const section1 = document.getElementById("first-part");
    const alertParagraphIcon = document.createElement("div");
    alertParagraphIcon.className = "alert-icon-paragraph";
    const icon1 = document.createElement("i");
    icon1.className = "fas fa-exclamation-triangle";
    const noticeText = document.createElement("p");
    noticeText.textContent = "שים לב אירוע חדש התווסף";
    const icon2 = document.createElement("i");
    icon2.className = "fas fa-exclamation-triangle";
    alertParagraphIcon.appendChild(icon1);
    alertParagraphIcon.appendChild(noticeText);
    alertParagraphIcon.appendChild(icon2);
    const eventPhoto = document.createElement("div");
    eventPhoto.className = "event-photo";
    const img = document.createElement("img");
    img.src = "images/map_noa.png";
    img.alt = "Event Photo";
    eventPhoto.appendChild(img);
    const rectangleContainer = document.createElement("div");
    rectangleContainer.className = "rectangle-container";
    const redButton = document.createElement("a");
    redButton.className = "red-rectangle";
    redButton.innerHTML = "<p>סירוב</p>";
    redButton.style.textDecoration = 'none';
    redButton.addEventListener("click", function() {
        changeButton(redButton, greenButton);
    });
    const greenButton = document.createElement("a");
    greenButton.className = "green-rectangle";
    greenButton.innerHTML = "<p>קבלת אירוע</p>";
    greenButton.href = "userDetails.html";
    greenButton.style.textDecoration = 'none';
    rectangleContainer.appendChild(redButton);
    rectangleContainer.appendChild(greenButton);
    section1.appendChild(alertParagraphIcon);
    section1.appendChild(eventPhoto);
    section1.appendChild(rectangleContainer);
}

function changeButton(redButton, greenButton) {
    redButton.style.display = "none";
    greenButton.classList.add('new-accept-button'); 
    greenButton.innerHTML = "<p>אירוע פעיל, באפשרותך להכנס בכל רגע נתון</p>";
}

function drawSecondPart() {
    const section2 = document.getElementById("second-part");
    const p2ElementContainer = document.createElement("div");
    p2ElementContainer.className = "p2-element-container";
    const realTimeText = createRealTimeText();
    p2ElementContainer.appendChild(realTimeText);
    section2.appendChild(p2ElementContainer);
    const verticalLine = document.createElement("div");
    verticalLine.className = "vertical-line";
    p2ElementContainer.appendChild(verticalLine);
    const startTime = new Date();
    startTime.setHours(14);
    startTime.setMinutes(50);
    for (let i = 0; i < 3; i++) {
        const reportContainer = createReportContainer(startTime, i);
        p2ElementContainer.appendChild(reportContainer);
    }
    const lastReportContainer = createLastReportContainer();
    p2ElementContainer.appendChild(lastReportContainer);
}

function createRealTimeText() {
    const realTimeText = document.createElement("div");
    realTimeText.className = "real-time-text";
    realTimeText.textContent = "דיווחים בזמן אמת";
    const alertIcon = document.createElement("img");
    alertIcon.src = "images/alert-icon.png";
    alertIcon.className = "alert-icon";
    realTimeText.appendChild(alertIcon);
    return realTimeText;
}

function createReportContainer(startTime, index) {
    const reportContainer = document.createElement("div");
    reportContainer.className = "report-container";
    const reportDate = new Date(startTime.getTime() + index * 10 * 60000);
    const hours = reportDate.getHours().toString().padStart(2, '0');
    const minutes = reportDate.getMinutes().toString().padStart(2, '0');
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "dots-container";
    const dotWrapper = document.createElement("div");
    dotWrapper.className = "dot-wrapper";
    const dot = document.createElement("span");
    dot.className = "dot-time";
    dot.textContent = "•";
    const reportTime = document.createElement("p");
    reportTime.className = "report-time";
    reportTime.textContent = `${hours}:${minutes}`;
    dotWrapper.appendChild(dot);
    dotWrapper.appendChild(reportTime);
    const horizontalLine = document.createElement("div");
    horizontalLine.className = "horizontal-line";
    dotWrapper.appendChild(horizontalLine);
    dotsContainer.appendChild(dotWrapper);
    reportContainer.appendChild(dotsContainer);
    reportTime.style.color = "black";
    reportTime.style.fontWeight = "bold";
    reportTime.style.fontFamily = "Inter";
    return reportContainer;
}

function createLastReportContainer() {
    const lastReportContainer = document.createElement("div");
    lastReportContainer.className = "report-container";
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "dots-container";
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.textContent = "•";
        dotsContainer.appendChild(dot);
    }
    const imgReport = document.createElement("img");
    imgReport.src = "images/report-img.jpeg";
    imgReport.alt = "crash-photo";
    imgReport.className = "accident-photo";
    lastReportContainer.appendChild(imgReport);
    const textStyle = createTextStyle();
    lastReportContainer.appendChild(textStyle);
    lastReportContainer.appendChild(dotsContainer);
    return lastReportContainer;
}

function createTextStyle() {
    const textStyle = document.createElement("div");
    textStyle.className = "text-style";
    // You can add static text here if needed
    return textStyle;
}

function toggleImage() {
    const image = document.getElementById("hidden-image");
    if (image.style.display === "none") {
        image.style.display = "block";
    } else {
        image.style.display = "none";
    }
}

function drawThirdPart() {
    const section3 = document.getElementById("third-part");
    const historyContainer = document.createElement("div");
    historyContainer.className = "history-container";
    const line = document.createElement("div");
    line.className = "line";
    const historyLink = document.createElement("a");
    historyLink.className = "history-link";
    historyLink.textContent = "לכל היסטוריית האירועים";
    historyLink.href = "eventList.html";
    historyContainer.appendChild(line);
    historyContainer.appendChild(historyLink);
    addTextElements();
    section3.appendChild(historyContainer);
}

function addTextElements() {
    const section3 = document.getElementById("third-part");
    const textContainer = document.createElement("div");
    textContainer.className = "text-history-table";
    const descriptionText = document.createElement("p");
    descriptionText.className = "text-item";
    descriptionText.textContent = " פרטי אירוע";
    const statusText = document.createElement("p");
    statusText.className = "text-item";
    statusText.textContent = "סטטוס";
    const eventDetailsText = document.createElement("p");
    eventDetailsText.className = "text-item";
    eventDetailsText.textContent = "תיאור ";
    textContainer.appendChild(descriptionText);
    textContainer.appendChild(statusText);
    textContainer.appendChild(eventDetailsText);
    section3.appendChild(textContainer);
}

function addDescriptionElements(eventsHistory) {
    const section3 = document.getElementById("third-part");
    const description = document.createElement("div");
    description.className = "text-description";
    for (let i = 0; i < eventsHistory.length; i++) {
        const des = eventsHistory[i];
        const reportDes = document.createElement("p");
        reportDes.className = "report-des";
        if (des.description === "הסתיים ללא נפגעים") {
            const words = des.description.split(" ");
            words.forEach(word => {
                const span = document.createElement("span");
                span.textContent = word;
                span.style.display = "block";
                reportDes.appendChild(span);
            });
        } else {
            reportDes.textContent = des.description;
        }
        description.appendChild(reportDes);
    }
    section3.appendChild(description);
}
