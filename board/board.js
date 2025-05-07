const mainContainer = document.getElementById("navbar_container");
const overlay = document.getElementById("overlay_background_container");
const taskDetailCard = document.getElementById("task_detail_card");

/**
 * Zeigt die nav der sidebar
 * 
 */
function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

/**
 * Zeigt das Task-Detail Template an
 * 
 */
function renderDetailTemplate() {
    overlay.classList.remove("fade_out");
    taskDetailCard.classList.remove("closed");
}

/**
 * Schließt das Task-Detail Template
 * 
 */
function closeDetailTemplate() {
    overlay.classList.add("fade_out");
    taskDetailCard.classList.add("closed");
}

/**
 * Verhindert das Schließen beim Klick auf die Karte
 * 
 */
function eventBubbling(event) {
    event.stopPropagation();
}

function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

window.onload = async function() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }

        renderSidebar();
        renderHeader();
        updateUserProfile();
    } catch (error) {
        console.error("Error initializing board:", error);
    }
};