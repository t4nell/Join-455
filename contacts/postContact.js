function createNewContact(event) {
  event.preventDefault();
  const contactData = collectContactData();

  console.log(contactData.name);
  if (contactData) {
    postContactData("contact", contactData, contactData.email);
    return;
   }
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
  if (checkIfValid(contact, fullName, "") && checkEmailAlreadyExists(contact.email)) {
    return contact;
  }else{
    return;
  }
}

async function postContactData(path = "", data = {}, email) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    closeNewContactOverlay(email)
    return (responseToJson = await response.json());
  } else {
    console.error("Error posting contact data:", response.statusText);
  }
  }


function checkIfValid(contact, fullName, isEdit){
  const isNameValid = validateName(fullName, isEdit);
  const isEmailValid = validateEmail(contact.email, isEdit);
  const isPhoneValid = validatePhone(contact.phone, isEdit);
  
  if (isNameValid && isEmailValid && isPhoneValid) {
  return true;
  }else{
    return;
  }
}

function validateName(fullName, isEdit) {
  const alertName = document.getElementById(isEdit + "name_alert");
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

function validateEmail(email, isEdit) {
  const alertEmail = document.getElementById(isEdit + "mail_alert");
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

function validatePhone(phone, isEdit) {
  const alertPhone = document.getElementById(isEdit + "phone_alert");
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

async function closeNewContactOverlay(mail) {
  toggleOverlay();
  const savedContactNotification = document.getElementById('contact_notification');
  savedContactNotification.innerHTML = `<p>Contact successfully created</p>`;
  savedContactNotification.classList.remove('closed');
  resetInputFields();
  clearGroupedContacts();
  await loadContactData();
  showNewContact(mail);
  // groupContacts();
  setTimeout(() => {
    document.getElementById('contact_notification').classList.add('closed');
  }, 3000);
}

function showNewContact(email){
  const allContacts = document.querySelectorAll(".contact_side")
  const contactDetailsContainer = document.getElementById("contact_detail_container");
  const newContactDiv = document.querySelector(`.contact_side[data-email="${email}"]`);
  const contact = contactsArray.find(contact => contact.email === email);
    if (contact){
      allContacts.forEach((contact) => {contact.classList.remove("active")});
      newContactDiv.classList.add("active")
      contactDetailsContainer.classList.remove("closed") ;
      contactDetailsContainer.innerHTML = getContactDetailsTemplate(contact);
    }
}

