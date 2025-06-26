let selectedUserIndices = [];

/**
 * Listens for clicks outside the assigned users dropdown and closes the dropdown if a click occurs outside.
 *
 * @param {MouseEvent} event - The click event triggered anywhere in the document.
 * @returns {void} Closes the assigned users dropdown if the click is outside relevant elements.
 */
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('dropdown');
    const toggleBtn = document.getElementById('dropdown_toggle_btn');
    const selectedUser = document.getElementById('selected_users_group');

    if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !toggleBtn.contains(event.target) &&
        !selectedUser.contains(event.target)
    ) {
        closeAssignedDropdown();
    }
});

/**
 * Filters contacts based on the input value and displays matching contacts.
 *
 * @returns {void} Updates the dropdown menu with filtered contacts.
 */
function filterContacts() {
    const toggle = document.getElementById('dropdown_toggle_btn');
    const menu = document.getElementById('dropdown_menu');

    const filter = toggle.value.toLowerCase();
    menu.innerHTML = '';
    allContactsArray.forEach((contact, index) => {
        const fullName = `${contact.name} ${contact.surname}`.toLowerCase();
        if (fullName.includes(filter)) {
            menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
        }
    });

    if (!menu.innerHTML) {
        menu.innerHTML = noContactsFoundToAssignedTemplate();
    }
}

/**
 * Toggles the visibility of the assigned contacts dropdown.
 *
 * @param {Event} event - The event that triggered the function.
 * @returns {void} Shows or hides the dropdown and selected users.
 */
function toggleDropdownAssigned(event) {
    event.stopPropagation();
    if (typeof closeCategoryDropdown === 'function') {
        closeCategoryDropdown();
    }
    const dropdown = document.getElementById('dropdown');
    const toggle = document.getElementById('dropdown_toggle_btn');
    const isOpen = dropdown.classList.toggle('open');

    if (!isOpen) {
        toggle.value = '';
        toggle.blur();
    }
    filterContacts();
}

/**
 * Toggles the background color of a selected contact item.
 *
 * @param {number} index - The index of the contact to toggle.
 * @returns {void} Updates the visual state of the contact item.
 */
function toggleBackground(index) {
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    if (clickedItem) {
        clickedItem.classList.toggle('active');
    }
}

/**
 * Closes the assigned users dropdown.
 *
 * @returns {void} Closes the dropdown and updates UI elements.
 */
function closeAssignedDropdown() {
    const dropdown = document.getElementById('dropdown');
    const toggle = document.getElementById('dropdown_toggle_btn');

    if (dropdown) {
        dropdown.classList.remove('open');
    }
    if (toggle) {
        toggle.value = '';
    }
}

/**
 * Loads all contacts into the assignment dropdown.
 *
 * @returns {void} Populates the dropdown menu with all contacts.
 */
function loadAllContactsToAssigned() {
    const menu = document.getElementById('dropdown_menu');

    menu.innerHTML = '';
    allContactsArray.forEach((contact, index) => {
        menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
    });
}

/**
 * Selects or deselects a user for assignment to a task.
 *
 * @param {number} index - The index of the contact to select.
 * @param {Event} event - The click event.
 * @returns {void} Updates selection state and refreshes display.
 */
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

/**
 * Renders the icons of selected users in the display area.
 *
 * @returns {void} Updates the selected users display with icons.
 */
function renderSelectedIcons() {
    const selectedUser = document.getElementById('selected_users_group');

    selectedUser.innerHTML = '';
    const selectedContacts = selectedUserIndices.map((index) => allContactsArray[index]);
    selectedUser.innerHTML += filterMaxVisibility(selectedContacts);
}

/**
 * Limits and renders the selected contacts' icons with a maximum visibility threshold.
 *
 * @param {Array} SelectedContact - Array of selected contact objects to be displayed.
 * @returns {string} HTML markup for the visible contact icons, including a +X indicator if needed.
 */
function filterMaxVisibility(SelectedContact) {
    if (!SelectedContact) return '';
    const maxVisibilitySelectedIcons = 4;
    const assignedContacts = SelectedContact;
    let SelectedIconsHtml = assignedContacts
        .slice(0, maxVisibilitySelectedIcons)
        .map((contact, index) => {
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
            return renderSelectedIconsTemplate(index, initials, bgColor);
        })
        .join('');
    if (assignedContacts.length > maxVisibilitySelectedIcons) {
        SelectedIconsHtml += renderMoreUserIcons(assignedContacts.length, maxVisibilitySelectedIcons);
    }
    return SelectedIconsHtml;
}

/**
 * Clears all selected users from the assignment list.
 *
 * @returns {void} Unchecks all checkboxes and removes active states.
 */
function clearSelection() {
    allContactsArray.forEach((box, index) => {
        const checkbox = document.getElementById(`users_checkbox_${index}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    removeActiveBgColor();
}

/**
 * Removes active background color from all contact items.
 *
 * @returns {void} Resets the visual state of all contact items.
 */
function removeActiveBgColor() {
    const items = document.getElementsByClassName('dropdown_item');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    loadAllContactsToAssigned();
}

/**
 * Resets the list of selected user indices.
 *
 * @returns {void} Clears selection array and refreshes display.
 */
function clearSelectedUserIndices() {
    selectedUserIndices = [];
    filterContacts();
    renderSelectedIcons();
}

