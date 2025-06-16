/**
 * @description Opens the edit overlay for the current user, allowing them to edit their own details.
 *
 */
function editCurrentUserOverlay(){
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  overlay.classList.remove("fade_out");
  editContactPopup.classList.remove("closed");
  editContactPopup.innerHTML = getCurrentUserEditOverlay(currentUserInitials)
  document.getElementById('edit_name').value = currentUser.name
  document.getElementById('edit_mail').value = currentUser.email
  if (currentUser.phone) {
      document.getElementById('edit_phone').value = currentUser.phone
  }else{
    document.getElementById('edit_phone').value = "+49"
  }
}

/**
 *@description Validates the name, email, and phone number fields for the current user.
 *
 * @param {*} newNameParts - An array containing the first and last name of the user.
 * @param {*} newEmail - The new email address of the user.
 * @param {*} newPhone - The new phone number of the user.
 * @param {*} isEdit - A flag indicating whether the validation is for editing the current user.
 * @return {*} - Returns true if all fields are valid, otherwise returns undefined.
 */
function checkValidation(newNameParts, newEmail, newPhone, isEdit){
  const isNameValid = validateName(newNameParts, isEdit);
  const isEmailValid = validateEmail(newEmail, isEdit);
  const isPhoneValid = validatePhone(newPhone, isEdit);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const emailExists = users.some(user => user.email === newEmail && user.email !== currentUser.email);
  if (isNameValid && isPhoneValid && isEmailValid && !emailExists) {
    return true;
  }else{
    return;
  }
}


/**
 * @description Saves the current user's information after validation.
 *
 * @param {*} event - preventDefault event to stop the form from reloading the page.
 */
function saveCurrentUserInfo(event){
  event.preventDefault();
  const newName =  document.getElementById('edit_name').value 
  const newEmail = document.getElementById('edit_mail').value 
  const newPhone = document.getElementById('edit_phone').value
  const newNameParts = newName.split(" ");
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let users = JSON.parse(localStorage.getItem('users')) || [];

  const ValidatedFields = checkValidation(newNameParts, newEmail, newPhone, "edit_");
    if (ValidatedFields) {
      users = users.map(user => {
      if(user.email === currentUser.email){
        return{
          ...user, name: newName, email: newEmail, phone : newPhone};
      }
    return user;
});
  localStorage.setItem('users', JSON.stringify(users));
  currentUser = {...currentUser, name: newName, email: newEmail, phone: newPhone};
  localStorage.setItem('currentUser', JSON.stringify(currentUser))
  closeCurrentUserEditProcess();
}};



/**
 * @description Renders the current user's details and initials in the main container and user container after edit.
 *
 */
function renderCurrentUserViews() {
  const mainContainer = document.querySelector('#contact_detail_container');
  const userContainer = document.querySelector('.current_user_container');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("");

  mainContainer.innerHTML = getCurrentUserDetailsTemplate(currentUser, currentUserInitials);
  userContainer.innerHTML = getCurrentUserTemplate(currentUser, currentUserInitials);
}


/**
 * @description Closes the current user edit process by clearing the main container, rendering the current user views, toggling the overlay, and showing a notification.
 *
 */
function closeCurrentUserEditProcess() {
  const mainContainer = document.querySelector("#contact_detail_container");
  mainContainer.innerHTML = "";
  renderCurrentUserViews();
  toggleOverlay();
  const currentUserDiv = document.getElementById("current_user");
  currentUserDiv.classList.add('active');
  showNotification('User edited successfully')
}