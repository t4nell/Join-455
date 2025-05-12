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
    loadContactsToAssigned();
}

