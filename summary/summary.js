const mainContainer = document.getElementById("navbar_container");
const greetingContainer = document.getElementById("summary_greating_container");

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

//Tageszeit abhängige Begrüßung
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
    //Namen aus dem Local Storage holen
    const userName = localStorage.getItem('userName') || 'Ego Ist';
    
    greetingContainer.innerHTML = `${greeting},<br>${userName}`;
}

window.onload = function() {
    renderSidebar();
    updateGreeting();
};