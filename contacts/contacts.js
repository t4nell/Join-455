const mainContainer = document.getElementById("navbar_container");
const newContactPopup = document.getElementById("contact_popup");
const editContactPopup = document.getElementById("contact_edit_overlay");
const overlay = document.getElementById("contact_overlay");

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

function toggleOverlayNewContact(){
    popup.classList.toggle("closed");
    overlay.classList.toggle("fade_out");
}

function toggleOverlay(){
    overlay.classList.add("fade_out");
    newContactPopup.classList.add("closed");
    editContactPopup.classList.add("closed");
}

function eventBubbling(event){
    event.stopPropagation();
}

function newContactOverlay(){
    overlay.classList.remove("fade_out");
    newContactPopup.classList.remove("closed");
}

function editContactOverlay(){
    overlay.classList.remove("fade_out");
    editContactPopup.classList.remove("closed");
}