/**
 * Checks if all contact details are valid.
 * @param {Object} contact - The contact object containing the fields email and phone.
 * @param {string[]} fullName - An array of first and last name parts.
 * @param {string} isEdit - Prefix or identifier for the current form (New contact or Edit contact).
 * @returns {boolean|undefined} Returns true if all fields are valid, otherwise undefined.
 */
function checkIfValid(contact, fullName, isEdit) {
  const isNameValid = validateName(fullName, isEdit);
  const isEmailValid = validateEmail(contact.email, isEdit);
  const isPhoneValid = validatePhone(contact.phone, isEdit);

  if (isNameValid && isEmailValid && isPhoneValid) {
    return true;
  } else {
    return;
  }
}

/**
 * Validates the name.
 * @param {string[]} fullName - Array containing the parts of the first and last name.
 * @param {string} isEdit - Prefix or identifier for the current form (New contact or edit contact).
 * @returns {boolean} Returns true if the name is valid, otherwise false.
 */
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

/**
 * Validates the email address.
 * @param {string} email - The email address to validate.
 * @param {string} isEdit - Prefix or identifier for the current form (New contact or edit contact).
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 */
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

/**
 * Validates the phone number.
 * @param {string} phone - The phone number to validate.
 * @param {string} isEdit - Prefix or identifier for the current form (New contact or edit contact).
 * @returns {boolean} Returns true if the phone number is valid, otherwise false.
 */
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

/**
 * Checks if the email address already exists in the contact list.
 * @param {string} email - The email address to check.
 * @returns {boolean} Returns false and displays a warning if the email exists, otherwise true.
 */
function checkEmailAlreadyExists(email) {
  const emailExists = contactsArray.some((contact) => contact.email === email);
  if (emailExists) {
    const alertEmail = document.getElementById("mail_alert");
    alertEmail.classList.add("show");
    alertEmail.innerHTML = "Email already exists";
    return false;
  } else {
    return true;
  }
}
