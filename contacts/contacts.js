const mainContainer = document.getElementById("navbar_container");
const newContactPopup = document.getElementById("contact_popup");
const editContactPopup = document.getElementById("contact_edit_overlay");
const overlay = document.getElementById("contact_overlay");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")


let contactsArray = [];
const groupedContacts = {};

async function contactInit() {
  renderHeader();
  renderSidebar();
  loadCurrentUser();
  await loadContactData();
  groupContacts();
}

//kontakte fetchen
//kontakte nach name sortieren
//kontakte in array speichern
//kontakte in html rendern

function loadCurrentUser() {

  const currentUserDiv = document.createElement("div");
  // currentUserDiv.classList.add("contact_side", "current_user");
  currentUserDiv.innerHTML = getCurrenUserTemplate(currentUser, currentUserInitials);
  const contactListContainer = document.getElementById("contact_list_container");

  contactListContainer.appendChild(currentUserDiv);
}


async function fetchContactData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
    
  } catch (error) {
    console.error("Error loading contact data:", error);
  }
}

async function loadContactData(){
  await fetchContactData("contact");
  
  const contactsRef = responseToJson;
  contactsArray = Object.values(contactsRef);
  
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


function collectContactData(){
  const form = document.getElementById("new_contact_form");
  const fd = new FormData(form);
  const randomColorNumber = Math.floor(Math.random() * 20) + 1;
  let randomContactColor = `var(--profile-color-${randomColorNumber})`;
  const fullName = fd.get("new_contact_name").split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];


  const contact = {
    name: firstName,
    surname: lastName,
    email: fd.get("new_contact_email"),
    phone: fd.get("new_contact_phone"),
    color: randomContactColor,
  };

  return contact;
}

function createNewContact(event) {
  event.preventDefault();
  const form = document.getElementById("add_contact_form");
  const contactData = collectContactData(form);

  console.log(contactData);
  
  postContactData('contact', contactData);
}

async function postContactData(path = "", data = {}){
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return (responseToJson = await response.json());
  }else {
    console.error("Error posting contact data:", response.statusText);
  }
};



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
      contactDetailsContainer.classList.remove("closed");
      contactDetailsContainer.innerHTML = "";
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

function showCurrentUserDetails() {
  console.log(currentUser);
  
  const currentUserDiv = document.getElementById("current_user");
  const mainContainer = document.querySelector("#contact_detail_container")
  const allContacts = document.querySelectorAll(".contact_side");
  
  if (currentUserDiv.classList.contains("active")) {
    return;
  }else{
    allContacts.forEach((contact) => {contact.classList.remove("active");});
    mainContainer.classList.add("closed");
    currentUserDiv.classList.add("active");
      setTimeout(() => {
    mainContainer.innerHTML = getCurrentUserDetailsTemplate(currentUser, currentUserInitials);
        mainContainer.classList.remove("closed");
    }, 300)};
  }




function handleContactClick(event, contactIndex) {
  const allContacts = document.querySelectorAll(".contact_side");
  const contactMainContainer = document.getElementById("contact_detail_container");
  const clickedContact = event.currentTarget;
  
  if (clickedContact.classList.contains("active")) {
    return;
  }else{
    contactMainContainer.classList.add("closed");
    allContacts.forEach((contact) => {contact.classList.remove("active");});
    clickedContact.classList.add("active");
      setTimeout(() => {
        showContactDetails(contactIndex) ;
      }, 300);

  }

  
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


