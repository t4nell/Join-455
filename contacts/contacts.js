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

function loadCurrentUser() {
  const currentUserDiv = document.createElement("div");
  currentUserDiv.classList.add("current_user_container");
  currentUserDiv.innerHTML = getCurrenUserTemplate(currentUser, currentUserInitials);
  const contactListContainer = document.getElementById("contact_list_container");
  contactListContainer.appendChild(currentUserDiv);
}

async function fetchContactData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
  } catch (error) {
    console.error("Error loading contact data:", error);
  }
}

async function loadContactData() {
  await fetchContactData("contact");
  const contactsRef = responseToJson;
  contactsArray = Object.values(contactsRef);
groupContacts(contactsArray);
}

function groupContacts(contactsArray) {  
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

function getRandomUserColor() {
    const randomColorNumber = Math.floor(Math.random() * 20) + 1;
  let randomContactColor = `var(--profile-color-${randomColorNumber})`;
  return randomContactColor;
}

function collectContactData() {
  const form = document.getElementById("new_contact_form");
  const fd = new FormData(form);
  const fullName = fd.get("new_contact_name").split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];
  const randomContactColor =  getRandomUserColor();
  const contact = {
    name: firstName,
    surname: lastName,
    email: fd.get("new_contact_email"),
    phone: fd.get("new_contact_phone"),
    color: randomContactColor
  };
  if (checkIfValid(contact, fullName) && checkEmailAlreadyExists(contact.email)) {
    return contact;
  }else{
   return;
  }
}

function checkEmailAlreadyExists(email) {
  const emailExists = contactsArray.some((contact) => contact.email === email);
  if (emailExists) {
    const alertEmail = document.getElementById("mail_alert");
    alertEmail.classList.remove("d_none");
    alertEmail.innerHTML = "Email already exists";
    return false;
  }else{
    return true;
}};

function checkIfValid(contact, fullName){
  const isNameValid = validateName(fullName);
  const isEmailValid = validateEmail(contact.email);
  const isPhoneValid = validatePhone(contact.phone);
  
  if (isNameValid && isEmailValid && isPhoneValid) {
  return true;
  }else{
    return;
  }
}

function validateName(fullName) {
  const alertName = document.getElementById("name_alert");
  const namePattern = /^[a-zA-ZäöüÄÖÜß]+$/;
  const isValid =
    fullName.length >= 2 && fullName.every((name) => namePattern.test(name));
  if (isValid) {
    alertName.classList.add("d_none");
    return true;
  } else {
    alertName.classList.remove("d_none");
    return false;
  }
}

function validateEmail(email) {
  const alertEmail = document.getElementById("mail_alert");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = email.trim() && emailPattern.test(email);
  if (isValid) {
    alertEmail.classList.add("d_none");
    return true;
  } else {
    alertEmail.classList.remove("d_none");
    return false;
  }
}

function validatePhone(phone) {
  const alertPhone = document.getElementById("phone_alert");
  const phonePattern = /^\+?[0-9\s\-()]+$/;
  const isValid = phonePattern.test(phone);
  if (isValid) {
    alertPhone.classList.add("d_none");
    return true;
  } else {
    alertPhone.classList.remove("d_none");
    return false;
  }
}


function createNewContact(event) {
  event.preventDefault();
  const form = document.getElementById("add_contact_form");
  const contactData = collectContactData(form);

  console.log(contactData);
  if (collectContactData()) {
    postContactData("contact", contactData);
   }else{
    return;
   }

}

async function postContactData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    closeNewContactOverlay()
    return (responseToJson = await response.json());
  } else {
    console.error("Error posting contact data:", response.statusText);
  }
  }

function closeNewContactOverlay() {
  toggleOverlay();
  document.getElementById('contact_save_message').classList.remove('closed');
  resetInputFields();
  clearGroupedContacts();
  loadContactData();
  // groupContacts();
  setTimeout(() => {
    document.getElementById('contact_save_message').classList.add('closed');
  }, 3000);
}

function resetInputFields(){
  document.getElementById('new_contact_name').value = ""
  document.getElementById('new_contact_email').value = ""
  document.getElementById('new_contact_phone').value = ""
}

function clearGroupedContacts(){
  contactsArray = [];

  for (const key in groupedContacts) {
    if(Object.hasOwnProperty.call(groupedContacts, key)) {
      delete groupedContacts[key];
    }
  }
}

function renderContactGroups(groupedContacts) {
  const contactListDiv = document.getElementById("all_contacts_container");
  const sortedLetters = Object.keys(groupedContacts).sort();
  contactListDiv.innerHTML = "";  // Diese funktion löscht den currentUser
  sortedLetters.forEach((letter) => {
    const contactTemplate = getContactListTemplate(letter, groupedContacts);
    contactListDiv.innerHTML += contactTemplate;
  });
}

function showContactDetails(contactIndex) {
  const contact = contactsArray[contactIndex];
  console.log(contact);
  if (contact) {
    const contactDetailsContainer = document.getElementById(
      "contact_detail_container"
    );
    contactDetailsContainer.classList.remove("closed");
    contactDetailsContainer.innerHTML = "";
    contactDetailsContainer.innerHTML = getContactDetailsTemplate(contact);
  }
}

function showCurrentUserDetails() {
  const currentUserDiv = document.getElementById("current_user");
  const mainContainer = document.querySelector("#contact_detail_container");
  const allContacts = document.querySelectorAll(".contact_side");

  if (currentUserDiv.classList.contains("active")) {
    return;
  } else {
    allContacts.forEach((contact) => {contact.classList.remove("active")});
    mainContainer.classList.add("closed");
    currentUserDiv.classList.add("active");
    setTimeout(() => {
      mainContainer.innerHTML = getCurrentUserDetailsTemplate(
        currentUser,
        currentUserInitials
      );
      mainContainer.classList.remove("closed");
    }, 300);
  }
}

function handleContactClick(event, contactIndex) {
  const allContacts = document.querySelectorAll(".contact_side");
  const contactMainContainer = document.getElementById("contact_detail_container");
  const clickedContact = event.currentTarget;

  if (clickedContact.classList.contains("active")) {
    return;
  } else {
    contactMainContainer.classList.add("closed");
    allContacts.forEach((contact) => {contact.classList.remove("active")});
    clickedContact.classList.add("active");
    setTimeout(() => {
      showContactDetails(contactIndex);
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
