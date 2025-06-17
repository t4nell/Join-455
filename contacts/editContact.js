/**
 * Saves the edited contact data by collecting the form data and sending it to the server.
 *
 * @param {*} event preventDefault - Prevents the default form submission behavior.
 * @return {*} - Returns the response from the server after saving the edited contact data.
 */
function saveEditContact(event) {
  event.preventDefault();
  const form = document.getElementById('edit_contact_form');
  const contactIndex = form.getAttribute('data-index');
  const currentContact = contactsArray[contactIndex]
  const contactData = collectEditContactData(currentContact);
    
  if (contactData) {
    putContactData("contact/" + currentContact.id, contactData, currentContact.id);
   }else{
    return;
   }
}


/**
 * Collects the data from the edit contact form and returns it as an object.
 *
 * @param {*} currentContact - The current contact object being edited.
 * @return {*} - Returns an object containing the edited contact data if valid, otherwise returns undefined.
 */
function collectEditContactData(currentContact) {
  const form = document.getElementById("edit_contact_form");
  const fd = new FormData(form);
  const fullName = fd.get("edit_contact_name").split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];

  const contact = {
    name: firstName,
    surname: lastName,
    email: fd.get("edit_contact_mail"),
    phone: fd.get("edit_contact_phone"),
    color: currentContact.color
  };
  if (checkIfValid(contact, fullName, "edit_") && checkEditEmailAlreadyExists(contact.email, currentContact)) {
    return contact;
  }else{
   return;
  }
}


/**
 * Sends a PUT request to update the contact data on the server.
 *
 * @param {string} [path=""] - The path to the contact data to be updated.
 * @param {*} [data={}] - The data to be sent in the request body.
 * @param {*} contactId - The ID of the contact being edited.
 * @return {*} - Returns the response from the server after updating the contact data.
 */
async function putContactData(path = "", data = {}, contactId) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    closeEditContactProcess(contactId)
    return (responseToJson = await response.json());
  } else {
    console.error("Error posting contact data:", response.statusText);
  }
  }



/**
 * Checks if the edited email already exists in the contacts array.
 *
 * @param {*} email - The email address to check for duplicates.
 * @param {*} currentContact - The current contact object being edited.
 * @return {*} - Returns true if the email is valid and does not already exist, otherwise returns false.
 */
function checkEditEmailAlreadyExists(email, currentContact) {
  const emailExists = contactsArray.some((contact) => contact.email === email);
  if (currentContact.email === email) {
      return true
  }else if (emailExists) {
    const alertEmail = document.getElementById("edit_mail_alert");
    alertEmail.classList.remove("show");
    alertEmail.innerHTML = "Email already exists";
    return false;
  }else{
    return true;
}};


/**
 * Closes the edit contact process by toggling the overlay, clearing grouped contacts, loading contact data, and showing the edited contact.
 *
 * @param {*} contactId
 */
async function closeEditContactProcess(contactId) {
  toggleOverlay();
  clearGroupedContacts();
  await loadContactData();
  showEditedContact(contactId)
  showNotification("Contact edited successfully")
}


/**
 * Displays the edited contact details in the contact detail container.
 *
 * @param {*} contactId - The ID of the contact to be displayed.
 * @return {*} - Returns the contact details template for the specified contact.
 */
function showEditedContact(contactId){
  const contact = contactsArray.find((contact) => contact.id === contactId)
  if (contact) {
    const editedContactDiv = document.querySelector(`.contact_side[data-email="${contact.email}"]`)
    const contactDetailsContainer = document.getElementById("contact_detail_container");
    contactDetailsContainer.classList.remove("closed");
    editedContactDiv.classList.add("active");
    contactDetailsContainer.innerHTML = getContactDetailsTemplate(contact);
  }else{
    console.error("Edited Contact not found")
  }
}