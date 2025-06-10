function createNewContact(event) {
    event.preventDefault();
    const contactData = collectContactData();

    if (contactData) {
        postContactData('contact', contactData, contactData.email);
        return;
    }
}

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
        console.log(key);

        return key;
    } else {
        console.error('Error posting contact data:', response.statusText);
    }
}

async function closeNewContactProcess(mail) {
    toggleOverlay();
    showNotification('Contact successfully created');
    resetInputFields();
    clearGroupedContacts();
    await loadContactData();
    showNewContact(mail);
}

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

function showNotification(notficationText) {
    const savedContactNotification = document.getElementById('contact_notification');
    savedContactNotification.innerHTML = `<p>${notficationText}</p>`;
    savedContactNotification.classList.remove('closed_notification');

    setTimeout(() => {
        document.getElementById('contact_notification').classList.add('closed_notification');
    }, 2000);
}

