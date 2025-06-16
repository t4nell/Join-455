/**
 * @description Loads the current user's information and initials into the user container.
 *
 */
function loadCurrentUser() {
  const currentUserDiv = document.querySelector('.current_user_container');
  currentUserDiv.innerHTML = getCurrentUserTemplate(currentUser, currentUserInitials);
}


/**
 * @description Renders the contact groups in the contact list container.
 *
 * @param {*} groupedContacts - An object containing contacts grouped by their first letter.
 */
function renderContactGroups(groupedContacts) {
  const contactListDiv = document.getElementById("all_contacts_container");
  const sortedLetters = Object.keys(groupedContacts).sort();
  contactListDiv.innerHTML = ""; 
  sortedLetters.forEach((letter) => {
    const contactTemplate = getContactListTemplate(letter, groupedContacts);
    contactListDiv.innerHTML += contactTemplate;
  });
}


/**
 * @description Displays the details of a specific contact in the contact detail container.
 *
 * @param {*} contactIndex - The index of the contact in the contactsArray to be displayed.
 */
function showContactDetails(contactIndex) {
  const contact = contactsArray[contactIndex];
  console.log(contact);
  if (contact) {
    const contactDetailsContainer = document.getElementById(
      "contact_detail_container"
    );
    contactDetailsContainer.classList.remove("closed");
    document.querySelector(".contact_container").classList.remove("mobile_closed");
    contactDetailsContainer.innerHTML = "";
    contactDetailsContainer.innerHTML = getContactDetailsTemplate(contact);
  }
}


/**
 * @description Groups contacts by the first letter of their names and renders them in the contact main container.
 *
 * @param {*} contactsArray - An array of contact objects to be grouped.
 */
function groupContacts(contactsArray) {  
  contactsArray.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  });
  renderContactGroups(groupedContacts);
}


/**
 * @description Displays current User details in the contact main container.
 *
 * @return {*} 
 */
function showCurrentUserDetails() {
  const currentUserDiv = document.getElementById("current_user");
  const mainContainer = document.querySelector("#contact_detail_container");
  const allContacts = document.querySelectorAll(".contact_side");
  const anyActive = document.querySelector(".contact_side.active, #current_user.active");

  if (currentUserDiv.classList.contains("active")) {
    return;
  } else {
    allContacts.forEach((contact) => contact.classList.remove("active"));
    mainContainer.classList.add("closed");
    currentUserDiv.classList.add("active");
    const render = () => {
      mainContainer.innerHTML = getCurrentUserDetailsTemplate(currentUser, currentUserInitials);
      mainContainer.classList.remove("closed");
      document.querySelector(".contact_container").classList.remove("mobile_closed");
    };
    if (anyActive) {
      setTimeout(render, 300);
    } else {
      render();
    }
  }
}

/**
 * @description - renders more information about the specific clicked contact
 *
 * @param {*} event - event of the current clicked contact
 * @param {*} contactIndex - Index of the contact from the contactsArray
 * @return {*} - returns the clicked contact from the contact list
 */
function handleContactClick(event, contactIndex) {
  const allContacts = document.querySelectorAll(".contact_side");
  const contactMainContainer = document.getElementById("contact_detail_container");
  const clickedContact = event.currentTarget;
  const anyActive = document.querySelector(".contact_side.active, #current_user.active");

  if (clickedContact.classList.contains("active")) {
    return;
  } else {
    contactMainContainer.classList.add("closed");
    allContacts.forEach((contact) => contact.classList.remove("active"));
    clickedContact.classList.add("active");
    const render = () => showContactDetails(contactIndex);
    if (anyActive) {
      setTimeout(render, 300);
    } else {
      render();
    }
  }
}

