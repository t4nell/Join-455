const mainContainer = document.getElementById("navbar_container");
const newContactPopup = document.getElementById("contact_popup");
const editContactPopup = document.getElementById("contact_edit_overlay");
const overlay = document.getElementById("contact_overlay");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("");



async function contactInit() {
  renderHeader();
  renderSidebar();
  updateUserProfile()
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
  newContactPopup.innerHTML = getNewContactOverlay();
}

function editContactOverlay(contactIndex) {
  overlay.classList.remove("fade_out");
  editContactPopup.classList.remove("closed");

  // const clickedContact = event.currentTarget
  const contact = contactsArray[contactIndex]
  editContactPopup.innerHTML = getEditContactOverlay(contact, contactIndex);
  console.log(contact);
  document.getElementById('edit_name').value = contact.name + " " + contact.surname
  document.getElementById('edit_mail').value = contact.email
  document.getElementById('edit_phone').value = contact.phone
}

function closeContactMain(){
  const allContacts = document.querySelectorAll(".contact_side");
  document.querySelector('.contact_container').classList.add('mobile_closed');
  allContacts.forEach((contact) => contact.classList.remove('active'));
  const contactMainContainer = document.getElementById("contact_detail_container");
  contactMainContainer.classList.add("closed");
}

function toggleContactOptions(event){
  event.stopPropagation();
  document.getElementById('contact_options_dropdown').classList.remove('closed');
  setTimeout(() => {
    document.addEventListener('click', closeContactMenuOnClickOutside);
  }, 0);
}


function closeContactMenuOnClickOutside(event) {
    const contactMenu = document.getElementById('contact_options_dropdown');
    if (!contactMenu.classList.contains('closed') && !contactMenu.contains(event.target)) {
        contactMenu.classList.add('closed');
        document.removeEventListener('click', closeContactMenuOnClickOutside);
    }
}