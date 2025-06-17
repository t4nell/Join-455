/**
 * Loads the current user's information and initials into the user container.
 *
 * @returns {void}
 */
function loadCurrentUser() {
  const currentUserDiv = document.querySelector('.current_user_container');
  currentUserDiv.innerHTML = getCurrentUserTemplate(currentUser, currentUserInitials);
}


/**
 * Renders the contact groups in the contact list container.
 *
 * @param {*} groupedContacts - An object containing contacts grouped by their first letter.
 * @returns {void}
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
 * Displays the details of a specific contact in the contact detail container.
 *
 * @param {*} contactIndex - The index of the contact in the contactsArray to be displayed.
 * @returns {void}
 */
function showContactDetails(contactIndex) {
  const contact = contactsArray[contactIndex];
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
 * Groups contacts by the first letter of their names and renders them in the contact main container.
 *
 * @param {*} contactsArray - An array of contact objects to be grouped.
 * @returns {void}
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
 * Displays current User details in the contact main container.
 *
 * @return {*} if no contact is active the function render is running with no delay otherwise render is running with a 300ms delay.
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
 * Renders more information about the specific clicked contact
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

