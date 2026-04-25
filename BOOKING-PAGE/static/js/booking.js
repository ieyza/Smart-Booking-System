// AUTO UPPERCASE NAME
document.getElementById("name").addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});

// FORM VALIDATION + REDIRECT
(() => {
  const form = document.getElementById("bookingForm");

  form.addEventListener("submit", function (e) {
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      window.location.href = "/confirmation.html";
    }

    form.classList.add("was-validated");
  });
})();

const bookingData = {
  roomId: document.getElementById("roomId").value,
  roomName: document.getElementById("roomName").value,
  date: document.getElementById("date").value,
  from: document.getElementById("from").value,
  to: document.getElementById("to").value,
  purpose: document.getElementById("purpose").value,
  image: "static/images/rooms/room1.jpg"
};

localStorage.setItem("bookingData", JSON.stringify(bookingData));

window.location.href = "confirmation.html";