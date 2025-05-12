const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdown_toggle_btn');
const menu = document.getElementById('dropdown_menu');
const items = menu.querySelectorAll('.dropdown_item');
const selectedUser = document.getElementById('selected_user_group');

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
}

document.onclick = function (event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
    }
};

function loadContactsToAssigned() {
    menu.innerHTML = '';

    contactsArray.forEach((contact, index) => {
        menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
    });
}

function loadContactsToAssignedTemplate(contact, index) {
    const bgColor = contactsArray[index].color;
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return `
<li class="dropdown_item" id="dropdown_item_${index}" onclick="selectUser(${index})">
  <div class="symbole_name_group">
    <div class="profile_icon" style="background-color: ${bgColor}">
      <span>${nameInitials}${surnameInitials}</span>
    </div>
    <div>
      <span class="contact_name">${contact.name} ${contact.surname}</span>
    </div>
  </div>
  <input
    id="option_${index}"
    class="assign_dropdown_input"
    type="checkbox"
    name="assigned_to"
    value="${contact.name} ${contact.surname}" />
</li>`;
}

// function addSelectedUserIcon(index) {
//     const bgColor = contactsArray[index].color;
//     const contact = contactsArray[index];
//     const nameInitials = contact.name
//         .split(' ')
//         .map((part) => part.charAt(0).toUpperCase())
//         .join('');
//     const surnameInitials = contact.surname
//         .split(' ')
//         .map((part) => part.charAt(0).toUpperCase())
//         .join('');

//     selectedUser.innerHTML = `
//   <div class="placeholder_icon">
//     <div class="profile_icon" style="background-color: ${bgColor}">
//       <span>${nameInitials}${surnameInitials}</span>
//     </div>
//   </div>`;
// }

function selectUser(index) {
    const checkbox = document.getElementById(`option_${index}`);
    const wasChecked = checkbox.checked;

    checkbox.checked = !wasChecked;

    if (!wasChecked) {
        console.log('is checked');
        // selectedIndices.add(index);
        // addSelectedUserIcon(index);
    } else {
        // selectedIndices.delete(index);
        // removeSelectedUserIcon(index);
        console.log('is not checked');
    }
}

