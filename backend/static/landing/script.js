function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error("Error loading component:", error));
}

// Load all components
loadComponent("advantages", "/static/landing/components/advantages.html");
loadComponent("features", "/static/landing/components/features.html");
loadComponent("flow", "/static/landing/components/flow.html");
loadComponent("target-user", "/static/landing/components/target-user.html");