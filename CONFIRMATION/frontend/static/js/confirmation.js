document.addEventListener("DOMContentLoaded", () => {

  console.log("JS Loaded");

  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (!bookingData) {
    alert("No booking data found");
    return;
  }

  document.getElementById("roomId").innerText = bookingData.roomId || "-";
  document.getElementById("roomName").innerText = bookingData.roomName || "-";
  document.getElementById("date").innerText = bookingData.date || "-";
  document.getElementById("fromTime").innerText = bookingData.from || "-";
  document.getElementById("toTime").innerText = bookingData.to || "-";
  document.getElementById("purpose").innerText = bookingData.purpose || "-";

  document.getElementById("roomImage").src =
    bookingData.image || "/static/images/rooms/default.jpg";
});


function goBack() {
  window.location.href = "/booking";
}


function confirmBooking() {

  // nanti sambung API sini
  alert("Booking Confirmed!");

  // clear temp data
  localStorage.removeItem("bookingData");

  window.location.href = "/booking-list";
}