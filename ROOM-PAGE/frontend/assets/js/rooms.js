// Select room
document.getElementById("roomDropdown").addEventListener("change", function () {
    console.log("Room selected:", this.value);
});

// View button placeholder
document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("click", function () {
        alert("View Room Details clicked");
    });
});

// Book button
document.querySelector(".btn-success").addEventListener("click", function () {
    alert("Redirect to booking page");
});

document.addEventListener('DOMContentLoaded', function () {

    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 300,

        dateClick: function(info) {
            alert("Selected date: " + info.dateStr);

            // nanti boleh connect dengan availability API
        },

        events: [
            {
                title: 'Booked',
                start: '2026-04-22'
            },
            {
                title: 'Booked',
                start: '2026-04-25'
            }
        ]
    });

    calendar.render();
});

document.getElementById("roomDropdown").addEventListener("change", function () {
    document.getElementById("roomName").innerText = this.value;
});