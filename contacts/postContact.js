/**
 * Creates a new contact by collecting data from the form and sending it to the backend.
 *
 * @param {*} event
 * @return {*} - returns console error if contactsData wasn't found
 */
function createNewContact(event) {
    event.preventDefault();
    const contactData = collectContactData();

    if (contactData) {
        postContactData('contact', contactData, contactData.email);
    }else{
        console.error('failed to create new contact')
    }
}


/**
 * Collects the data from the new contact form and returns it as an object.
 *
 * @return {*} - Returns an object containing the new contact data if valid, otherwise returns undefined.
 */
function collectContactData() {
    const form = document.getElementById('new_contact_form');
    const fd = new FormData(form);
    const fullName = fd.get('new_contact_name').split(' ');
    const firstName = fullName[0];
    const lastName = fullName[1];
    const randomContactColor = getRandomUserColor();
    const contact = {
        name: firstName,
        surname: lastName,
        email: fd.get('new_contact_email'),
        phone: fd.get('new_contact_phone'),
        color: randomContactColor,
    };
    if (checkIfValid(contact, fullName, '') && checkEmailAlreadyExists(contact.email)) {
        return contact;
    } else {
        return;
    }
}


/**
 * Sends a POST request to create a new contact in the backend.
 *
 * @param {string} [path=''] - The path to the contact data to be created.
 * @param {*} [data={}] - The data to be sent in the request body.
 * @param {*} email - The email of the contact being created, used to show the new contact after creation.
 * @return {*} - Returns the key of the newly created contact if successful, otherwise logs an error.
 */
async function postContactData(path = '', data = {}, email) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        const { name: key } = await response.json();

        closeNewContactProcess(email);

        return key;
    } else {
        console.error('Error posting contact data:', response.statusText);
    }
}


/**
 * Closes the new contact process by toggling the overlay, showing a notification, resetting input fields, clearing grouped contacts, and loading contact data.
 *
 * @param {*} mail - The email of the newly created contact, used to show the new contact in the contact details view.
 * @returns {void}
 */
async function closeNewContactProcess(mail) {
    toggleOverlay();
    showNotification('Contact successfully created');
    resetInputFields();
    clearGroupedContacts();
    await loadContactData();
    showNewContact(mail);
}


/**
 * Displays the newly created contact in the contact details view.
 *
 * @param {*} email - The email of the newly created contact, used to find and display the contact details.
 * @returns {void}
 */
function showNewContact(email) {
    const allContacts = document.querySelectorAll('.contact_side');
    const contactDetailsContainer = document.getElementById('contact_detail_container');
    const newContactDiv = document.querySelector(`.contact_side[data-email="${email}"]`);
    const contact = contactsArray.find((contact) => contact.email === email);
    if (contact) {
        allContacts.forEach((contact) => {
            contact.classList.remove('active');
        });
        newContactDiv.classList.add('active');
        contactDetailsContainer.classList.remove('closed');
        document.querySelector('.contact_container').classList.remove('mobile_closed');
        contactDetailsContainer.innerHTML = getContactDetailsTemplate(contact);
    }
}


/**
 * Displays a notification message for a specified duration.
 *
 * @param {*} notficationText - The text to be displayed in the notification.
 * @returns {void}
 */
function showNotification(notficationText) {
    const savedContactNotification = document.getElementById('contact_notification');
    savedContactNotification.innerHTML = `<p>${notficationText}</p>`;
    savedContactNotification.classList.remove('closed_notification');

    setTimeout(() => {
        document.getElementById('contact_notification').classList.add('closed_notification');
    }, 2000);
}

