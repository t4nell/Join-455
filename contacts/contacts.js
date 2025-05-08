const mainContainer = document.getElementById("navbar_container");
const newContactPopup = document.getElementById("contact_popup");
const editContactPopup = document.getElementById("contact_edit_overlay");
const overlay = document.getElementById("contact_overlay");


let contactsArray = [];
const groupedContacts = {};

async function contactInit() {
  renderHeader();
  renderSidebar();
  loadCurrentUser();
  await loadContactData("");
  // renderContactList();
  groupContacts();
}




//kontakte fetchen
//kontakte nach name sortieren
//kontakte in array speichern
//kontakte in html rendern

function loadCurrentUser() {
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("");
  const currentUserDiv = document.createElement("div");
  // currentUserDiv.classList.add("contact_side", "current_user");
  currentUserDiv.innerHTML = `<div class="letter_index"">
                                User
                                </div>
                                <div class="letter_separator_horizontal">
                                    <hr class="separator_horizontal" />
                                </div>
                            <div class="contact_side" id="current_user">
                                <div class="profile_icon">
                                    <span>${currentUserInitials}</span>
                                </div>
                                <div class="contact_side_info">
                                    <div class="contact_side_name">
                                        <span>${currentUser.name} ${currentUser.surname ? `${currentUser.surname}` : ''} (You)</span>
                                    </div>
                                    <div class="contact_side_mail">
                                        <span>${currentUser.email}</span>
                                    </div>
                                </div>
                            </div></div>`;
  const contactListContainer = document.getElementById("contact_list_container");


  contactListContainer.appendChild(currentUserDiv);
}

async function loadContactData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    const contactsRef = responseToJson.contact;
    contactsArray = Object.values(contactsRef);
    contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error loading contact data:", error);
  }
  console.log(contactsArray);
}

function groupContacts() {
  contactsArray.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  });
  console.log(groupedContacts);
  renderContactGroups(groupedContacts);
}

function renderContactGroups(groupedContacts) {
  const contactListContainer = document.getElementById("contact_list_container");

  const sortedLetters = Object.keys(groupedContacts).sort();

  sortedLetters.forEach((letter) => {
    const letterGroup = `
        <div class="letter_group" id="letter_group_${letter}">
            <div class="letter_index" id="letter_index_container_${letter}">
                ${letter}
            </div>
            <div class="letter_separator_horizontal">
                <hr class="separator_horizontal" />
            </div>
            <div class="contacts_container">
                ${groupedContacts[letter].map((contact, index) => `
                    <div class="contact_side" id="${index}">
                        <div class="profile_icon">
                            <span>${contact.name.charAt(0).toUpperCase()}${contact.surname.charAt(0).toUpperCase() ? `${contact.surname.charAt(0).toUpperCase()}` : ""}</span>
                        </div>
                        <div class="contact_side_info">
                            <div class="contact_side_name">
                                <span>${contact.name} ${contact.surname}</span>
                            </div>
                            <div class="contact_side_mail">
                                <span>${contact.email}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
        
    contactListContainer.innerHTML += letterGroup;
});
}


function renderSidebar() {
  mainContainer.innerHTML += getSidebarTemplate();
}

function toggleOverlayNewContact() {
  popup.classList.toggle("closed");
  overlay.classList.toggle("fade_out");
}

function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

async function renderContactList() {
    await loadContactData();
    console.log(contactsArray);
    
    const contactListContainer = document.getElementById("contact_list_container");
    const allContacts = contactsArray[0].id.map((contact, index) => `
    <div class="contact_list_item" id="contact_${index}">
    <div class="contact_small_img">
            <img src="../assets/imgs/contactIcons/profile_badge.svg" alt="" />
          </div>
          <div class="contact_side_info">
            <div class="contact_side_name">
              <span>${contact.name}</span>
            </div>
            <div class="contact_side_mail">
              <span>antom@gmail.com</span>
            </div>
          </div></div>`).join("");
    contactListContainer.innerHTML = allContacts;
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

function editContactOverlay(){
    overlay.classList.remove("fade_out");
    editContactPopup.classList.remove("closed");
}


