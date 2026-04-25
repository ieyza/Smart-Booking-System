function login() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    if (!email) {
        alert("Please enter email");
        return;
    }

    // simulate login (for now)
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_role", role);

    if (role === "admin") {
        window.location.href = "../ADMIN DASHBOARD/index.html";
    } else {
        window.location.href = "../ROOM LIST/index.html";
    }
}