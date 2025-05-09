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
  groupContacts();
}

//kontakte fetchen
//kontakte nach name sortieren
//kontakte in array speichern
//kontakte in html rendern

function loadCurrentUser() {
  const currentUserDiv = document.createElement("div");
  // currentUserDiv.classList.add("contact_side", "current_user");
  currentUserDiv.innerHTML = getCurrenUserTemplate();
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
    const contactTemplate = getContactListTemplate(letter, groupedContacts);
    contactListContainer.innerHTML += contactTemplate;
});
}

function showContactDetails(contactIndex) {
  const contact = contactsArray[contactIndex];
   console.log(contact);
   if (contact) {
      const contactDetailsContainer = document.getElementById("contact_detail_container");
      contactDetailsContainer.innerHTML = "";
      contactDetailsContainer.classList.remove("closed");
      contactDetailsContainer.innerHTML = `
                <div class="contact_header">
            <div class="profile_icon_large" style="background-color: ${contact.color}">
                            <span>${contact.name.charAt(0).toUpperCase()}${contact.surname.charAt(0).toUpperCase() ? `${contact.surname.charAt(0).toUpperCase()}` : ""}</span>
                        </div>

            <div class="contact_head">
              <div class="contact_name">
                <span>${contact.name} ${contact.surname}</span>
              </div>

              <div class="contact_buttons">
                <button onclick="editContactOverlay()" class="contact_btn">
                  <img src="../assets/imgs/contactIcons/edit.svg" alt="" /> Edit
                </button>
                <button class="contact_btn">
                  <img src="../assets/imgs/contactIcons/delete.svg" alt="" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="contact_information_text">
            <span>Contact Information</span>
          </div>

          <div class="contact_details">
            <div class="contact_mail">
              <span class="contact_category">Email</span>
              <a href="">${contact.email}</a>
            </div>

            <div class="contact_phone">
              <span class="contact_category">Phone</span>
              <span>${contact.phone}</span>
            </div>
          </div>
        </div>`
   }
};

function handleContactClick(event, contactIndex) {
  const allContacts = document.querySelectorAll(".contact_side");
  const contactMainContainer = document.getElementById("contact_detail_container");
  if (!contactMainContainer.classList.contains("closed")) {
    contactMainContainer.classList.add("closed");
  }
  allContacts.forEach((contact) => {contact.classList.remove("active");});
  const clickedContact = event.currentTarget;
  clickedContact.classList.add("active");
  setTimeout(() => {
    showContactDetails(contactIndex) ;
  }, 300);
  
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


