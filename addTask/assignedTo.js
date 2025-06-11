let selectedUserIndices = [];

function filterContacts() {
    const toggle = document.getElementById('dropdown_toggle_btn');
    const menu = document.getElementById('dropdown_menu');

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

    const dropdown = document.getElementById('dropdown');
    const selectedUser = document.getElementById('selected_users_group');
    const toggle = document.getElementById('dropdown_toggle_btn');

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
    if (clickedItem) {
        clickedItem.classList.toggle('active');
    }
}

function closeDropdown(event) {
    const dropdown = document.getElementById('dropdown');
    const toggle = document.getElementById('dropdown_toggle_btn');
    const selectedUser = document.getElementById('selected_users_group');

    let currentElement = event.target;
    let clickedInside = false;

    while (currentElement) {
        if (
            currentElement.id === 'dropdown' ||
            currentElement.id === 'dropdown_toggle_btn' ||
            currentElement.id === 'selected_users_group'
        ) {
            clickedInside = true;
            break;
        }
        currentElement = currentElement.parentElement;
    }

    if (!clickedInside) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
        toggle.value = '';
    }
}

function loadAllContactsToAssigned() {
    const menu = document.getElementById('dropdown_menu');

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
    const selectedUser = document.getElementById('selected_users_group');

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
        }
    });
    removeActiveBgColor();
}

function removeActiveBgColor() {
    const items = document.getElementsByClassName('dropdown_item');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    loadAllContactsToAssigned();
}

function clearSelectedUserIndices() {
    selectedUserIndices = [];
    filterContacts();
    renderSelectedIcons();
}

