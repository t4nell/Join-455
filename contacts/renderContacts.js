function renderContactGroups(groupedContacts) {
  const contactListDiv = document.getElementById("all_contacts_container");
  const sortedLetters = Object.keys(groupedContacts).sort();
  contactListDiv.innerHTML = ""; 
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

