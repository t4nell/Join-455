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
    alertName.classList.remove("show");
    return true;
  } else {
    alertName.classList.add("show");
    return false;
  }
}

function validateEmail(email, isEdit) {
  const alertEmail = document.getElementById(isEdit + "mail_alert");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = email.trim() && emailPattern.test(email);
  if (isValid) {
    alertEmail.classList.remove("show");
    return true;
  } else {
    alertEmail.classList.add("show");
    return false;
  }
}

function validatePhone(phone, isEdit) {
  const alertPhone = document.getElementById(isEdit + "phone_alert");
  const phonePattern = /^\+?[0-9\s\-()]+$/;
  const isValid = phonePattern.test(phone);
  if (isValid) {
    alertPhone.classList.remove("show");
    return true;
  } else {
    alertPhone.classList.add("show");
    return false;
  }
}

function checkEmailAlreadyExists(email) {
  const emailExists = contactsArray.some((contact) => contact.email === email);
  if (emailExists) {
    const alertEmail = document.getElementById("mail_alert");
    alertEmail.classList.add("show");
    alertEmail.innerHTML = "Email already exists";
    return false;
  }else{
    return true;
}};