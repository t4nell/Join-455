const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdown_toggle_btn');
const menu = document.getElementById('dropdown_menu');
const items = menu.querySelectorAll('.dropdown_item');
const selectedUser = document.getElementById('selected_user_group');

const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

let contactsArray = [];

function initFetch() {
    loadContactData();
}

async function loadContactData(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseToJson = await response.json();
        const contactsRef = responseToJson.contact;
        contactsArray = Object.values(contactsRef);
        contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
}

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
    addContacts();
}

document.onclick = function (event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
    }
};

function addContacts() {
    menu.innerHTML = '';

    contactsArray.forEach((contact, index) => {
        menu.innerHTML += contactTemplate(contact, index);
    });
}

function contactTemplate(contact, index) {
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
    value="Option 1" />
</li>`;
}

function selectUser(index) {
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

    selectedUser.innerHTML = `
  <div class="placeholder_icon">
    <div class="profile_icon" style="background-color: ${bgColor}">
      <span>${nameInitials}${surnameInitials}</span>
    </div>
  </div>`;
}

