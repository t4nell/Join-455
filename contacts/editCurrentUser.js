function editCurrentUserOverlay(){
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

function saveCurrentUserInfo(){
    document.getElementById('edit_name').value = currentUser.name
    document.getElementById('edit_mail').value = currentUser.email
    document.getElementById('edit_phone').value = currentUser.phone
    
}