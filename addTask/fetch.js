const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

let contactsArray = [];

async function loadContactData(path = '') {
    try {
        const response = await fetch(BASE_URL + path + '.json');
        const data = await response.json();
        const contactsRef = data.contact || {};

        contactsArray = Object.entries(contactsRef)
            .map(([id, contact]) => ({ id, ...contact }))
            .sort((a, b) => a.name.localeCompare(b.name));

        console.log(contactsArray);
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadAllContactsToAssigned();
}

