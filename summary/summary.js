const mainContainer = document.getElementById("navbar_container");
const greetingContainer = document.getElementById("summary_greating_container");

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

function updateGreeting() {
    const now = new Date();
    let greeting;
    const hours = now.getHours();
    
    if (hours >= 0 && hours < 10) {
        greeting = "Guten Morgen";
    } else if (hours >= 10 && hours < 19) {
        greeting = "Guten Tag";
    } else {
        greeting = "Guten Abend";
    }
    
   
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.name || 'Gast';
    
    greetingContainer.innerHTML = `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
}

window.onload = function() {
    // Sicherstellen, dass ein Benutzer eingeloggt ist
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }

    renderSidebar();
    updateGreeting();
    
    // Gast-Hinweis anzeigen
    if (currentUser.isGuest) {
        showNotification('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
    }
};