const mainContainer = document.getElementById("navbar_container");
const newContactPopup = document.getElementById("contact_popup");
const editContactPopup = document.getElementById("contact_edit_overlay");
const overlay = document.getElementById("contact_overlay");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("");

let contactsArray = [];
const groupedContacts = {};

async function contactInit() {
  renderHeader();
  renderSidebar();
  loadCurrentUser();
  await loadContactData();
  // groupContacts();
}

//kontakte fetchen
//kontakte nach name sortieren
//kontakte in array speichern
//kontakte in html rendern











function renderSidebar() {
  mainContainer.innerHTML += getSidebarTemplate();
}

function toggleOverlayNewContact() {
  popup.classList.toggle("closed");
  overlay.classList.toggle("fade_out");
}

function renderHeader() {
  const headerContainer = document.getElementById("header_container");
  headerContainer.innerHTML = getHeaderTemplate();
}

function toggleOverlay() {
  overlay.classList.add("fade_out");
  newContactPopup.classList.add("closed");
  editContactPopup.classList.add("closed");
}

function eventBubbling(event) {
  event.stopPropagation();
}

function newContactOverlay() {
  overlay.classList.remove("fade_out");
  newContactPopup.classList.remove("closed");
}

function editContactOverlay() {
  overlay.classList.remove("fade_out");
  editContactPopup.classList.remove("closed");
}
