const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdown_toggle_btn');
const menu = document.getElementById('dropdown_menu');
const selectedUser = document.getElementById('selected_users_group');

function filterContacts() {
    const filter = toggle.value.toLowerCase();
    menu.innerHTML = '';
    let found = false;

    contactsArray.forEach((contact, index) => {
        const fullName = `${contact.name} ${contact.surname}`.toLowerCase();
        if (fullName.includes(filter)) {
            menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
            found = true;
        }
    });

    if (!found) {
        menu.innerHTML =
            '<li class="dropdown_item_no_contact_found"><div class="no-results">No contact found</div></li>';
    }
}

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
    toggle.value = '';
    // loadContactsToAssigned();
}

function toggleBackground(index) {
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    clickedItem.classList.toggle('active');
}

document.onclick = function (event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
        toggle.value = '';
        // loadContactsToAssigned();
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
<li class="dropdown_item" id="dropdown_item_${index}" onclick="selectUser(${index}, event)">
  <div class="symbole_name_group">
    <div class="profile_icon" style="background-color: ${bgColor}">
      <span>${nameInitials}${surnameInitials}</span>
    </div>
    <div>
      <span class="contact_name">${contact.name} ${contact.surname}</span>
    </div>
  </div>
  <input
    id="users_checkbox_${index}"
    class="assign_dropdown_input"
    type="checkbox"
    name="assigned_to"
    value="${contact.name} ${contact.surname}" 
    onclick="selectUser(${index}, event)"/>
</li>`;
}

function selectUser(index, event) {
    event.stopPropagation();
    const checkbox = document.getElementById(`users_checkbox_${index}`);

    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }

    if (checkbox.checked) {
        addSelectedUserIcon(index);
        toggleBackground(index);
    } else {
        removeSelectedUser(index);
        toggleBackground(index);
    }
}

function removeSelectedUser(index) {
    const userIconContainer = document.getElementById(`selected_user_${index}`);
    userIconContainer.remove();
}

function addSelectedUserIcon(index) {
    contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    const bgColor = contactsArray[index].color;
    const contact = contactsArray[index];
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;

    selectedUser.innerHTML += addSelectedUserIconTemplate(index, bgColor, initials);
}

function addSelectedUserIconTemplate(index, bgColor, initials) {
    return `
    <div id="selected_user_${index}">
  <div class="placeholder_icon">
    <div class="profile_icon" style="background-color: ${bgColor}">
      <span>${initials}</span>
    </div>
    </div>
  </div>`;
}

function clearSelection() {
    contactsArray.forEach((box, index) => {
        const checkbox = document.getElementById(`users_checkbox_${index}`);
        if (checkbox) {
            checkbox.checked = false;
            removeActiveBgColor();
        }
    });
}

function removeActiveBgColor() {
    const items = document.getElementsByClassName('dropdown_item');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    loadContactsToAssigned();
}

