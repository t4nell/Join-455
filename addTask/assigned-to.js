const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdown_toggle_btn');
const menu = document.getElementById('dropdown_menu');
const selectedUser = document.getElementById('selected_users_group');

let selectedUserIndices = [];

function filterContacts() {
    const filter = toggle.value.toLowerCase();
    menu.innerHTML = '';

    contactsArray.forEach((contact, index) => {
        const fullName = `${contact.name} ${contact.surname}`.toLowerCase();
        if (fullName.includes(filter)) {
            menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
        }
    });

    if (!menu.innerHTML) {
        menu.innerHTML =
            '<li class="dropdown_item_no_contact_found"><div class="no-results">No contact found</div></li>';
    }
}

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');

    if (!dropdown.classList.contains('open')) {
        toggle.value = '';
        toggle.blur();
    }

    filterContacts();
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
        // filterContacts();
    }
};

function loadContactsToAssigned() {
    menu.innerHTML = '';
    contactsArray.forEach((contact, index) => {
        menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
    });
}

function loadContactsToAssignedTemplate(contact, index) {
    const isSelected = selectedUserIndices.includes(index);
    const activeClass = isSelected ? ' active' : '';
    const checkedAttr = isSelected ? 'checked' : '';

    const bgColor = contact.color;
    const nameInitials = contact.name
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase())
        .join('');

    return `
<li class="dropdown_item${activeClass}" id="dropdown_item_${index}" onclick="selectUser(${index}, event)">
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
    onclick="selectUser(${index}, event)"
    ${checkedAttr} />
</li>`;
}

function selectUser(index, event) {
    event.stopPropagation();
    const checkbox = document.getElementById(`users_checkbox_${index}`);
    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }

    if (checkbox.checked) {
        if (!selectedUserIndices.includes(index)) {
            selectedUserIndices.push(index);
        }
    } else {
        selectedUserIndices = selectedUserIndices.filter((i) => i !== index);
    }

    filterContacts();
    renderSelectedIcons();
}

function removeSelectedUser(index) {
    const userIconContainer = document.getElementById(`selected_user_${index}`);
    userIconContainer.remove();
}

function renderSelectedIcons() {
    selectedUser.innerHTML = '';
    selectedUserIndices.forEach((index) => {
        const contact = contactsArray[index];
        const bgColor = contact.color;
        const initials =
            contact.name
                .split(' ')
                .map((p) => p[0].toUpperCase())
                .join('') +
            contact.surname
                .split(' ')
                .map((p) => p[0].toUpperCase())
                .join('');
        selectedUser.innerHTML += `
        <div id="selected_user_${index}">
            <div class="placeholder_icon">
                <div class="profile_icon" style="background-color: ${bgColor}">
                    <span>${initials}</span>
                </div>
            </div>
        </div>`;
    });
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

function clearSelectedUserIndices() {
    selectedUserIndices = [];

    filterContacts();

    renderSelectedIcons();
}

