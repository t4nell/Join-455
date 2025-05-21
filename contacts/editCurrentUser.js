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

function saveCurrentUserInfo(){
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
          ...user,
          name: newName,
          email: newEmail,
          phone : newPhone 
        };
      }
    return user;
});
  localStorage.setItem('users', JSON.stringify(users));
  currentUser = {...currentUser, name: newName, email: newEmail, phone: newPhone};
  localStorage.setItem('currentUser', JSON.stringify(currentUser))
  closeCurrentUserEditProcess();
}};
function renderCurrentUserViews() {
  const mainContainer = document.querySelector('#contact_detail_container');
  const userContainer = document.querySelector('.current_user_container');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentUserInitials = currentUser.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  if (mainContainer) {
    mainContainer.innerHTML = getCurrentUserDetailsTemplate(currentUser, currentUserInitials);
  }
  if (userContainer) {
    userContainer.innerHTML = getCurrentUserTemplate(currentUser, currentUserInitials);
  }
}

function closeCurrentUserEditProcess() {
  const mainContainer = document.querySelector("#contact_detail_container");
  mainContainer.innerHTML = "";
  renderCurrentUserViews();
  clearGroupedContacts();
  loadContactData();
  toggleOverlay();
  const currentUserDiv = document.getElementById("current_user");
  if (currentUserDiv) {
    currentUserDiv.classList.add('active');
  }
  showNotification('User edited successfully')
}