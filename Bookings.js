let availability = JSON.parse(localStorage.getItem('availability')) || {
    Monday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
    Tuesday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
    Wednesday: { 1: 4, 2: 4, 3: 4 },
    Thursday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
    Friday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 }
};

let bookedRooms = JSON.parse(localStorage.getItem('bookedRooms')) || {};

function bookRoom(period, day) {
    const currentAvailability = availability[day][period];
    
    if (currentAvailability > 0) {
        document.getElementById("bookingModal").style.display = "block";

        updateRoomOptions(day, period);

        document.getElementById("bookingForm").onsubmit = function (e) {
            e.preventDefault();

            const checkbox = document.getElementById("TnC");
            const errorMessage = document.getElementById("error-message");

            if (!checkbox.checked) {
                errorMessage.style.display = "block";
                return;
            } else {
                errorMessage.style.display = "none";
            }

            const selectedRoom = document.getElementById("room").value;
            const bookingDetails = {
                period: period,
                day: day,
                room: selectedRoom
            };

            localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

            availability[day][period] -= 1;

            if (!bookedRooms[day]) bookedRooms[day] = {};
            if (!bookedRooms[day][period]) bookedRooms[day][period] = [];

            bookedRooms[day][period].push(selectedRoom);

            localStorage.setItem('availability', JSON.stringify(availability));
            localStorage.setItem('bookedRooms', JSON.stringify(bookedRooms));

            updateTimetableUI(day, period);

            window.location.href = "BookingConfirmation.html";
        };
    } else {
        alert("Sorry, no rooms available for this time slot.");
    }
}

function updateTimetableUI(day, period) {
    const roomCell = document.querySelector(`td[onclick="bookRoom(${period}, '${day}')"]`);
    const newAvailability = availability[day][period];

    roomCell.textContent = `${newAvailability} available`;

    if (newAvailability === 0) {
        roomCell.classList.add('booked');
        roomCell.style.cursor = 'not-allowed';
        roomCell.onclick = null;
    }
}

function closeModal() {
    document.getElementById("bookingModal").style.display = "none";

    const form = document.getElementById("bookingForm");
    if (form) form.reset();

    const errorMessage = document.getElementById("error-message");
    if (errorMessage) errorMessage.style.display = "none";
}

function updateRoomOptions(day, period) {
    const roomSelect = document.getElementById('room');
    const roomOptions = roomSelect.options;

    for (let i = 0; i < roomOptions.length; i++) {
        const roomValue = roomOptions[i].value;

        if (day && period && bookedRooms[day] && bookedRooms[day][period]?.includes(roomValue)) {
            roomOptions[i].disabled = true;
        } else {
            roomOptions[i].disabled = false;
        }
    }
}


function loadTimetable() {
    for (let day in availability) {
        for (let period in availability[day]) {
            const roomCell = document.querySelector(`td[onclick="bookRoom(${period}, '${day}')"]`);
            if (roomCell) {
                const availableCount = availability[day][period];
                roomCell.textContent = `${availableCount} available`;

                if (availableCount === 0) {
                    roomCell.classList.add('booked');
                    roomCell.style.cursor = 'not-allowed';
                    roomCell.onclick = null;
                } else {
                    roomCell.classList.remove('booked');
                    roomCell.style.cursor = 'pointer';
                    roomCell.onclick = function () {
                        bookRoom(parseInt(period), day);
                    };
                }
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", loadTimetable);

function loadBookedRooms() {
    const roomSelect = document.getElementById('room');
    const roomOptions = roomSelect.options;

    for (let i = 0; i < roomOptions.length; i++) {
        const roomValue = roomOptions[i].value;
        
        if (isRoomBooked(roomValue)) {
            roomOptions[i].disabled = true;
        } else {
            roomOptions[i].disabled = false;
        }
    }
}

function isRoomBooked(roomValue) {
    for (let day in bookedRooms) {
        for (let period in bookedRooms[day]) {
            if (bookedRooms[day][period] === roomValue) {
                return true;
            }
        }
    }
    return false;
}

function resetAvailability() {
    availability = {
        Monday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
        Tuesday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
        Wednesday: { 1: 4, 2: 4, 3: 4 },
        Thursday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
        Friday: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 }
    };

    localStorage.removeItem('availability');
    localStorage.removeItem('bookedRooms');
    localStorage.removeItem('bookingDetails');

    localStorage.setItem('availability', JSON.stringify(availability));
    localStorage.setItem('bookedRooms', JSON.stringify({}));

    loadTimetable();

    const roomSelect = document.getElementById('room');
    const roomOptions = roomSelect.options;

    for (let i = 0; i < roomOptions.length; i++) {
        roomOptions[i].disabled = false;
    }

    roomSelect.selectedIndex = 0;

    updateRoomOptions(); 
}
