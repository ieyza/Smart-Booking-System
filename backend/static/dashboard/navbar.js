// LOAD ADMIN INFO
function loadAdminInfo() {
  // contoh static dulu (nanti sambung API)
  const email = "admin@email.com";
  const lastLogin = "25 Apr 2026 · 08:00 AM";

  document.getElementById("adminEmail").innerText = email;
  document.getElementById("lastLogin").innerText = "Last login: " + lastLogin;
}

// LOGOUT FUNCTION
function logout() {
  // buang session/token (kalau ada)
  alert("Logged out");

  // redirect ke login page
  window.location.href = "/login";
}

// INIT
document.addEventListener("DOMContentLoaded", function () {
  loadAdminInfo();
});