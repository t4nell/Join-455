function saveEditContact(event, contactIndex) {
  event.preventDefault();
  const contactData = collectContactData(form);
  currentContact = contactsArray[contactIndex]
  console.log(currentContact);
    
  console.log(contactData);
  if (contactData) {
    postContactData("contact", contactData);
   }else{
    return;
   }
}


function collectContactData() {
  const form = document.getElementById("edit_contact_form");
  const fd = new FormData(form);
  const fullName = fd.get("edit_contact_name").split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];

  const contact = {
    name: firstName,
    surname: lastName,
    email: fd.get("new_contact_email"),
    phone: fd.get("new_contact_phone"),
  };
  if (checkIfValid(contact, fullName) && checkEmailAlreadyExists(contact.email)) {
    return contact;
  }else{
   return;
  }
}

async function putContactData(path = "", data = {}) {
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

