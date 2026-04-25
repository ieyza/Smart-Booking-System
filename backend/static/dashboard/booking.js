//DISPLAY TABLE (BOOKING LIST)
// SAMPLE DATA (later replace API Flask DB)

let bookings = [
  { id: 1, user: "Ali", date: "2026-04-25", time: "10:00", purpose: "Meeting", status: "Pending" },
  { id: 2, user: "Siti", date: "2026-04-25", time: "11:00", purpose: "Event", status: "Pending" }
];

// RENDER TABLE
function renderTable() {
  let table = document.getElementById("bookingTable");
  table.innerHTML = "";

  bookings.forEach((b, index) => {

    table.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.user}</td>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.purpose}</td>

        <!-- STATUS -->
        <td class="status-${b.status.toLowerCase()}">
          ${b.status}
        </td>

        <!-- ACTION BUTTONS -->
        <td>
          <button class="btn btn-success btn-sm"
            onclick="confirmAction(${index}, 'Approved')">
            Approve
          </button>

          <button class="btn btn-danger btn-sm"
            onclick="confirmAction(${index}, 'Rejected')">
            Reject
          </button>
        </td>
      </tr>
    `;
  });
}

// INIT TABLE ON LOAD
document.addEventListener("DOMContentLoaded", renderTable);

//confirm_approval box
function confirmAction(index, status) {

  let confirmMsg = `Are you sure you want to ${status.toLowerCase()} this booking?`;

  // POPUP CONFIRM BOX
  let result = confirm(confirmMsg);

  if (result) {
    updateBooking(index, status);
  }
}

//UPDATE BOOKING STATUS

function updateBooking(index, status) {

  // 1. UPDATE LOCAL DATA FIRST
  bookings[index].status = status;

  // 2. UPDATE UI TABLE
  renderTable();

  // 3. SEND TO BACKEND (FLASK DB UPDATE)
  fetch("/api/update-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bookings[index])
  })
  .then(res => res.json())
  .then(data => {
    console.log("DB updated:", data);
  })
  .catch(err => console.log("Error:", err));
}

// FILTER
// ORIGINAL DATA (from DB later)
let allBookings = [];
let filteredBookings = [];

function loadBookings() {
  fetch("/api/get-bookings")
    .then(res => res.json())
    .then(data => {
      allBookings = data;
      filteredBookings = data;
      renderTable(filteredBookings);
    });
}

document.addEventListener("DOMContentLoaded", loadBookings);

function renderTable(data) {

  let table = document.getElementById("bookingTable");
  table.innerHTML = "";

  data.forEach((b, index) => {

    table.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.user}</td>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.purpose}</td>
        <td>${b.booked_at}</td>
        <td>${b.status}</td>

        <td>
          <button onclick="confirmAction(${index}, 'Approved')">Approve</button>
          <button onclick="confirmAction(${index}, 'Rejected')">Reject</button>
        </td>
      </tr>
    `;
  });
}

function applyFilter() {

  // 1. GET INPUT VALUE
  let selectedDate = document.getElementById("filterDate").value;
  let selectedStatus = document.getElementById("filterStatus").value;

  // 2. FILTER LOGIC
  filteredBookings = allBookings.filter(b => {

    let matchDate = selectedDate ? b.date === selectedDate : true;
    let matchStatus = selectedStatus ? b.status === selectedStatus : true;

    return matchDate && matchStatus;
  });

  // 3. UPDATE TABLE
  renderTable(filteredBookings);
}

// =========================
// LOAD INITIAL DATA
// =========================
function loadBookings() {
  fetch("/api/get-bookings")
    .then(res => res.json())
    .then(data => {
      allBookings = data;
      renderTable(allBookings);
    });
}

// =========================
// INITIAL LOAD
// =========================
document.addEventListener("DOMContentLoaded", loadBookings);

// =========================
// SEMI-REALTIME CHECK
// =========================
let lastCount = 0;

setInterval(() => {

  fetch("/api/bookings-count")
    .then(res => res.json())
    .then(data => {

      if (data.count !== lastCount) {
        loadBookings(); // reload table only if ada perubahan
        lastCount = data.count;
      }

    });

}, 15000); // 15 seconds


// =========================
// MSG BOX (PART A) (OPEN)
// =========================
let selectedAction = null;
let selectedIndex = null;

// =========================
// MSG BOX (PART B) (HANDLE)
// =========================

function confirmAction(index, action) {

  selectedIndex = index;
  selectedAction = action;

  // SET TEXT
  document.getElementById("modalTitle").innerText = "Confirm Action";

  document.getElementById("modalMessage").innerText =
    `Are you sure you want to ${action.toLowerCase()} this booking?`;

  // SHOW MODAL
  document.getElementById("modalOverlay").classList.remove("hidden");

  // SET CONFIRM BUTTON ACTION
  document.getElementById("confirmBtn").onclick = executeAction;
}


// =========================
// MSG BOX (PART B) (EXCUTE ACTION)
// ===
function executeAction() {

  // update status dalam memory
  bookings[selectedIndex].status = selectedAction;

  // refresh table UI
  renderTable();

  // OPTIONAL: send ke backend
  fetch("/api/update-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bookings[selectedIndex])
  });

  // close modal
  closeModal();
}

// =========================
// MSG BOX (PART B) (CLOSE MODAL)
// ===
function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

// =========================
// PAGINATION
// ===
// =========================
// PART A - PAGINATION STATE
// ===
let currentPage = 1;
let rowsPerPage = 5;
let totalPages = 1;

// =========================
// PART B - CALCULATE PAGE
// ===

function setupPagination(data) {
  totalPages = Math.ceil(data.length / rowsPerPage);
  renderPagination();
}
// =========================
// PART C - RENDER 
// ===
function renderPagination() {

  let pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {

    pageNumbers.innerHTML += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}"
        onclick="goToPage(${i})">
        ${i}
      </button>
    `;
  }
}


// =========================
// PART D - CHANGE PAGE
// ===

function goToPage(page) {
  currentPage = page;
  renderTable(getPaginatedData());
  renderPagination();
}


// =========================
// PART E - NEXT/PREV PAGE
// ===
function changePage(action) {

  if (action === "next" && currentPage < totalPages) {
    currentPage++;
  }

  if (action === "prev" && currentPage > 1) {
    currentPage--;
  }

  renderTable(getPaginatedData());
  renderPagination();
}

// =========================
// PART F - GET DATA FOR PAGE
// ===
function getPaginatedData() {

  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;

  return filteredBookings.slice(start, end);
}

// =========================
// PART G - UPDATE RENDER TABLE
// ===
function renderTable(data = getPaginatedData()) {

  let table = document.getElementById("bookingTable");
  table.innerHTML = "";

  data.forEach((b, index) => {

    table.innerHTML += `
      <tr>
        <td>${b.id}</td>
        <td>${b.user}</td>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.purpose}</td>
        <td>${b.booked_at}</td>
        <td>${b.status}</td>

        <td>
          <button onclick="confirmAction(${index}, 'Approved')">Approve</button>
          <button onclick="confirmAction(${index}, 'Rejected')">Reject</button>
        </td>
      </tr>
    `;
  });
}


// =========================
// PART H - CONNECT FILTER AND PAGINATION
// ===
function applyFilter() {

  let date = document.getElementById("filterDate").value;
  let status = document.getElementById("filterStatus").value;

  filteredBookings = allBookings.filter(b => {

    let matchDate = date ? b.date === date : true;
    let matchStatus = status ? b.status === status : true;

    return matchDate && matchStatus;
  });

  currentPage = 1; // RESET PAGE
  setupPagination(filteredBookings);
  renderTable();
}

document.addEventListener("DOMContentLoaded", () => {
  loadBookings(); // load data
});


// =========================
// NOTIFICATION
// ===
// =========================
// PART A — NOTI STATE
// ===
let lastBookingTime = null;
let hasNotification = false;

// =========================
// PART B — CHECK NEW BOOKING
// ===

function checkNewBooking() {

  fetch("/api/latest-booking")
    .then(res => res.json())
    .then(data => {

      if (!data) return;

      // kalau booking baru lebih latest
      if (lastBookingTime !== data.booked_at) {

        lastBookingTime = data.booked_at;
        showNotification(data);
      }
    });
}



// =========================
// PART C — SHOW NOTIFICATION
// ===
function showNotification(data) {

  hasNotification = true;

  // SHOW BADGE
  document.getElementById("notifBadge").classList.remove("hidden");

  // SET MESSAGE
  document.getElementById("notifTime").innerText = data.booked_at;
}

// =========================
// PART D — TOGGLE NOTI
// ===
function toggleNotification() {

  let dropdown = document.getElementById("notifDropdown");

  dropdown.classList.toggle("hidden");

  // bila admin buka → remove badge
  if (hasNotification) {
    document.getElementById("notifBadge").classList.add("hidden");
    hasNotification = false;
  }
}

// =========================
// PART E — AUTO-CHECK (SEMI REAL-TIME)
// ===
setInterval(() => {
  checkNewBooking();
}, 15000); // 15s