/**
 * Generates HTML for a contact item in the assignment dropdown.
 *
 * @param {Object} contact - The contact data object to render.
 * @param {number} index - Index of the contact in the contact array.
 * @returns {string} HTML markup for the contact list item.
 */
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
    </li>
`;
}

/**
 * Creates the HTML template for when no contacts are found.
 *
 * @returns {string} HTML markup for no contacts found message.
 */
function noContactsFoundToAssignedTemplate() {
    return `
    <li class="dropdown_item_no_contact_found"><div class="no-results">No contact found</div></li>
`;
}

/**
 * Creates the HTML template for a selected user's icon.
 *
 * @param {number} index - Index of the selected user.
 * @param {string} initials - User's initials to display in the icon.
 * @param {string} bgColor - Background color code for the icon.
 * @returns {string} HTML markup for the selected user's icon.
 */
function renderSelectedIconsTemplate(index, initials, bgColor) {
    return `
        <div id="selected_user_${index}">
            <div class="placeholder_icon">
                <div class="profile_icon" style="background-color: ${bgColor}">
                    <span>${initials}</span>
                </div>
            </div>
        </div>`;
}

/**
 * Creates the HTML template for displaying the count of additional contacts beyond the visible limit.
 *
 * @param {number} totalContacts - The total number of assigned contacts.
 * @param {number} maxVisible - Maximum number of contacts to show individually.
 * @returns {string} HTML markup for the +X indicator.
 */
function renderMoreUserIcons(totalContacts, maxVisible) {
    return `
        <div class="user_icons more_user_icons">
            +${totalContacts - maxVisible}
        </div>
    `;
}

