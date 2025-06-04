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

function noContactsFoundToAssignedTemplate() {
    return `
    <li class="dropdown_item_no_contact_found"><div class="no-results">No contact found</div></li>
`;
}

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

