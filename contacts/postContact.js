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



