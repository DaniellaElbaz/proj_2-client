let eventErea;
const sortContainer=document.getElementById('sort-container');
window.onload = () => {
    fillSortContainer();
    eventErea = document.getElementById("events-container");
    fetch("data/Events.json")
        .then(response => response.json())
        .then(data => initMemberDetails(data));
};
        function fillSortContainer(){
            const sort = document.createElement('div');
            sort.classList.add('sort');
            const sortItem = document.createElement('div');
            sortItem.classList.add('sort-item');
            const add = document.createElement('div');
            add.classList.add('add');
            const addButton = document.createElement('button');
            addButton.classList.add('open');
            addButton.innerText='אירוע';
            add.appendChild(addButton);
            addButton.onclick = function () {
                addNewButton();
            }
            sortContainer.appendChild(add);
            const sortInput =document.createElement('input');
            sortInput.placeholder="חיפוש";
            sortInput.id="searchInput";
            sort.appendChild(sortInput);
            const clock = document.createElement('img');
            clock.src = "images/clock_down.png";
            clock.alt = "clock";
            clock.title = "clock";
            sortItem.appendChild(clock);
            const filter = document.createElement('img');
            filter.src = "images/un_filter.png";
            filter.alt = "filter";
            filter.title = "filter";
            sortItem.appendChild(filter);
            const box = document.createElement('img');
            box.src = "images/checkbox.png";
            box.alt = "checkbox";
            box.title = "checkbox";
            sortItem.appendChild(box);
            sortContainer.appendChild(sort);
            sortContainer.appendChild(sortItem);
        }
        function addNewButton() {
                const overList = document.createElement("div");
                overList.classList.add('popupOverlay');
                overList.appendChild(popForm());
                document.body.appendChild(overList);
        }
        function initMemberDetails(data) {
            const name = 'נועה לוינסון';
            let user_photo;
            let user;
            for (const memberKey in data.members) {
                user = data.members[memberKey];
                if (user.name == name) {
                    user_photo = user.user_photo;
                    events = user.events;
                    break;
                }
            }
            const userDetails = document.getElementById("UserImage");
            const photo = document.createElement('img');
            photo.src = user_photo;
            photo.alt = "user_photo";
            photo.title = "user_photo";
            userDetails.appendChild(photo);
            initRectangles(user);
        }
        function initRectangles(user) {
            eventErea = document.getElementById("events-container");
            eventErea.innerHTML = '';
            user.events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.classList.add('events-item');
                const h1 = document.createElement('h1');
                h1.innerText = event.event_name;
                eventItem.appendChild(h1);
                const table = document.createElement('table');
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.appendChild(initRectanglesEvenDetails(event));
                if (event.event_map) {
                    const td2 = document.createElement('td');
                    const map = document.createElement('img');
                    map.src = event.event_map;
                    map.alt = "Event Map";
                    map.title = "Event_Map";
                    td2.appendChild(map);
                    tr.appendChild(td2);
                }
                tr.appendChild(td);
                table.appendChild(tr);
                eventItem.appendChild(table);
                if (event.event_photo) {
                    const eventShow = document.createElement('div');
                    eventShow.classList.add('eventShow');
                    const eventText= document.createElement('p');
                    const button = document.createElement('button');
                    button.innerText = 'לחץ כאן';
                    button.addEventListener('click', () => { window.location.href = `event_report.html?eventId=${event.id}`;});
                    eventText.innerHTML = `:צפיה בדוח אירוע / מילוי דוח אירוע `;
                    eventShow.appendChild(button);
                    eventShow.appendChild(eventText);
                    eventItem.appendChild(eventShow);
                    eventItem.appendChild(initBottomRectangles(event));
                }
                eventErea.appendChild(eventItem);
            });
        }
        function initRectanglesEvenDetails(event) {
            const pDetails = document.createElement('p');
            const pDate = document.createElement('p');
            pDate.classList.add('pDate');
            pDate.innerHTML="תאריך: ";
            const spanDate = document.createElement('span');
            spanDate.classList.add('spanDate');
            spanDate.innerHTML=`${event.date_and_time}`;
            pDate.appendChild(spanDate);
            pDetails.appendChild(pDate);
            const pPlace = document.createElement('p');
            pPlace.classList.add('pPlace');
            pPlace.innerHTML="מקום האירוע: ";
            const spanPlace = document.createElement('span');
            spanPlace.classList.add('spanPlace');
            spanPlace.innerHTML=`${event.event_place}`;
            pPlace.appendChild(spanPlace);
            pDetails.appendChild(pPlace);
            const pStatus = document.createElement('p');
            pStatus.classList.add('pStatus');
            pStatus.innerHTML="סטטוס: ";
            const spanStatus = document.createElement('span');
            spanStatus.classList.add('spanStatus');
            spanStatus.innerHTML=`${event.event_status}`;
            pStatus.appendChild(spanStatus);
            pDetails.appendChild(pStatus);
            return(pDetails);
        }
        function initBottomRectangles(event) {
            const eventLabel = document.createElement('p');
            eventLabel.innerHTML = `:זירת האירוע`;
            const img = document.createElement('img');
            img.src = event.event_photo;
            img.alt = "Event_Place";
            img.title = "Event_Place";
            const imgDelete = document.createElement('img');
            imgDelete.classList = "delete-icon";
            imgDelete.src = "images/delete.png";
            imgDelete.title = "delete";
            imgDelete.alt = "delete";
            imgDelete.addEventListener('click', function() {
                const userConfirmed = confirm("האם אתה בטוח שתרצה למחוק את האירוע?");
                if (userConfirmed) {
                    alert("הדוח נמחק בהצלחה!");
                    window.location.href = "eventList.html";
                }
            });
            const eventContainer = document.createElement('div');
            eventContainer.classList.add('event-item-container');
            const iconEventContainer = document.createElement('div');
            iconEventContainer.classList.add('iconEventContainer');
            iconEventContainer.appendChild(imgDelete);
            eventContainer.appendChild(img);
            eventContainer.appendChild(eventLabel);
            iconEventContainer.appendChild(eventContainer);
            return iconEventContainer;
        }
        function popForm() {
            const form = document.createElement("form");
            form.classList.add('popup');
            const addList = document.createElement("div");
            addList.classList.add('addList');
            const addListItem = document.createElement("div");
            addListItem.classList.add('addListItem');
            addListItem.appendChild(buttonExit());
            addList.appendChild(addListItem);
            addListItem.appendChild(inputTitleAddEvent(form));
            addList.appendChild(addListItem);
            addListItem.appendChild(inputEventTextBox(form));
            addList.appendChild(addListItem);
            addListItem.appendChild(initSelectBox())
            addList.appendChild(addListItem);
            addListItem.appendChild(buttonSend());
            addList.appendChild(addListItem);
            form.appendChild(addList);
            return form;
        }
        function initSelectBox(){
            const p = document.createElement('p');
            p.classList.add('inline');
            const type = document.createElement('select');
            type.id = "NewSelectType";
            const options = [
                { value: " ", text: " " },
                { value: "תאונה", text: "תאונה" },
                { value:  "טרור", text: "טרור"},
                { value:  "שריפה", text:  "שריפה" }
            ];
            for (const opt of options) {
                const option = document.createElement('option');
                option.value = opt.value;
                option.text = opt.text;
                type.appendChild(option);
            }
            const typeLabel = document.createTextNode(":סוג האירוע");
            const requiredSpan = document.createElement("span");
            requiredSpan.innerHTML ="*";
            p.appendChild(type);
            p.appendChild(typeLabel);
            p.appendChild(requiredSpan);
            return p;
        }
        function inputTitleAddEvent() {
            const addListItem = document.createElement("div");
            addListItem.classList.add('heder');
            const h1 = document.createElement('h1');
            h1.innerText = " יצירת אירוע חדש" ;
            addListItem.appendChild(h1);
            return addListItem;
        }
        function inputEventTextBox(form) {
            let inputItem = document.createElement('div');
            inputItem.classList.add('New-input');
            const when = document.createElement('p');
            let star = document.createElement('span');
            star.innerHTML ="*";
            let star2 = document.createElement('span');
            star2.innerHTML ="*";
            when.innerText = "?מתי ואיפה האירוע ";
            when.appendChild(star);
            inputItem.appendChild(when);
            const textWhen = document.createElement('textarea');
            textWhen.id = "textareaWhenE";
            textWhen.name="whenText";
            textWhen.maxLength = 90;
            form.appendChild(textWhen);
            inputItem.appendChild(whenCount(textWhen));
            const explain = document.createElement('p');
            explain.innerHTML = "הסבר/י על האירוע";
            explain.appendChild(star2);
            inputItem.appendChild(explain);
            const textExplain = document.createElement('textarea');
            textExplain.id = "textareaExplainE";
            textExplain.name="explainText";
            textExplain.maxLength = 300;
            form.appendChild(textExplain);
            inputItem.appendChild(explainCount(textExplain));
            textWhen.addEventListener('input', () => updateCharCount(textWhen, "whenCharCount"));
            textExplain.addEventListener('input', () => updateCharCount(textExplain, "explainCharCount"));
            return inputItem;
        }