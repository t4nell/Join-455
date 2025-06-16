const BASE_URL_ADDTASK = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

let allContactsArray = [];

async function loadAllContactData(path = '') {
    try {
        const response = await fetch(BASE_URL_ADDTASK + path + '.json');
        const data = await response.json();
        const contactsRef = data.contact || {};

        allContactsArray = Object.entries(contactsRef)
            .map(([id, contact]) => ({ id, ...contact }))
            .sort((a, b) => a.name.localeCompare(b.name));

        console.log(allContactsArray);
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadAllContactsToAssigned();
}

