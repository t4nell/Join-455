// edit als parameter übergeben für validation?
// angeklickter contact informationen erhalen ? in saveEdit : collectEditContactData


function saveEditContact(event) {
  event.preventDefault();
  const form = document.getElementById('edit_contact_form');
  const contactIndex = form.getAttribute('data-index');
  const currentContact = contactsArray[contactIndex]

  console.log(currentContact);
  
  
  const contactData = collectEditContactData(currentContact);

    
  console.log(contactData);
  if (contactData) {
    putContactData("contact/" + currentContact.id, contactData, currentContact.id);
   }else{
    return;
   }
}


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

function checkEditEmailAlreadyExists(email, currentContact) {
  const emailExists = contactsArray.some((contact) => contact.email === email);
  if (currentContact.email === email) {
      return true
  }else if (emailExists) {
    const alertEmail = document.getElementById("edit_mail_alert");
    alertEmail.classList.remove("d_none");
    alertEmail.innerHTML = "Email already exists";
    return false;
  }else{
    return true;
}};

async function closeEditContactProcess(contactId) {
  toggleOverlay();
  const editContactNotification = document.getElementById('contact_notification');
  editContactNotification.innerHTML = `<p>Contact successfully edited</p>`;
  editContactNotification.classList.remove('closed');
  clearGroupedContacts();
  await loadContactData();
  showEditedContact(contactId)
  // groupContacts();
  setTimeout(() => {
    document.getElementById('contact_notification').classList.add('closed');
  }, 3000);
}

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