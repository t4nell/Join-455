const mainContainer = document.getElementById("navbar_container");
const popup = document.getElementById("contact_popup");
const overlay = document.getElementById("contact_overlay");

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

function toggleOverlayNewContact(){
    popup.classList.toggle("closed");
    overlay.classList.toggle("fade_out");
}

function eventBubbling(event){
    event.stopPropagation();
}

