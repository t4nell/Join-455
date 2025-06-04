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
        menu.innerHTML = noContactsFoundToAssignedTemplate();
    }
}

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
    if (!isOpen) {
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
    }
};

function loadContactsToAssigned() {
    menu.innerHTML = '';
    contactsArray.forEach((contact, index) => {
        menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
    });
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
        selectedUser.innerHTML += renderSelectedIconsTemplate(index, initials, bgColor);
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

