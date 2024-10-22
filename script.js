const startTimeSelect = document.getElementById("start-time");
const endTimeSelect = document.getElementById("end-time");

let startHour = 8;
let endHour = 17;
populateDropDown(startTimeSelect, 8);
populateDropDown(endTimeSelect, 17);

function populateDropDown(selectElem, selectedValue) {
    for (let i = 0; i < 24; i++) {
        let optionElem = document.createElement("option");
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00'
        hour += i < 12 ? ' AM' : ' PM'
        optionElem.text = hour;
        optionElem.value = i;
        if (i === selectedValue) {
            optionElem.selected = true;
        }
        selectElem.appendChild(optionElem);
    }
}

startTimeSelect.addEventListener('change', function () {
    startHour = parseInt(this.value);
    creatTimeTable();
})

endTimeSelect.addEventListener('change', function () {
    endHour = parseInt(this.value);
    creatTimeTable();
})

function creatTimeTable() {
    const divTable = document.getElementById("timeTable");
    let tableHTML = '<table><theah><tr><th></th>'
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    days.forEach(days => {
        tableHTML += `<th class="day-header">${days}</th>`
    })
    tableHTML += '</tr></thead><tbody>'

    //time slots

    for (let i = startHour; i <= endHour; i++) {
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00'
        hour += i < 12 ? ' AM' : ' PM'

        tableHTML += `<tr><td class="time-label">${hour}</td>`;
        days.forEach(day => {
            tableHTML += `
            <td class="time-slot"
                onclick="toggleTimeSlot(this)"
                data-day="${day}"
                data-time="${hour}">
            </td>
            `;
        });
        tableHTML += '</tr>'
    }

    tableHTML += '</tbody></table>'
    divTable.innerHTML = tableHTML;
}

const selectedTimeSlots = new Set();
function toggleTimeSlot(elem) {
    const timeSlotId = `${elem.dataset.day}-${elem.dataset.time}`
    if (selectedTimeSlots.has(timeSlotId)) {
        selectedTimeSlots.delete(timeSlotId);
        elem.classList.remove("selected");
    } else {
        selectedTimeSlots.add(timeSlotId);
        elem.classList.add("selected")
    }
}
document.getElementById("submitMeeting").addEventListener("click", async function () {
    const name = document.getElementById("user-name").value;
    const eventName = document.getElementById("event-name").value;
    if (!name || !eventName) {
        alert("Enter your name and event name!")
        return;
    };
    const bodyPayload = {
        username: name,
        eventName: eventName,
        slots: [...selectedTimeSlots]
    }
    const API_URL = 'https://jsonplaceholder.typicode.com/posts';
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(bodyPayload),
        headers: {
            'Content-type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data)
})

creatTimeTable();