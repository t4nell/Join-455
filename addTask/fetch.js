const BASE_URL_ADDTASK = 'https://join-9e844-default-rtdb.europe-west1.firebasedatabase.app/';

let allContactsArray = [];

/**
 * Loads all contact data from the server and prepares it for display.
 * 
 * @param {string} path - The API path to fetch contacts from, defaults to empty string.
 * @returns {Promise<void>} Updates the global allContactsArray and loads contacts into the UI.
 */
async function loadAllContactData(path = '') {
    try {
        const response = await fetch(BASE_URL_ADDTASK + path + '.json');
        const data = await response.json();
        const contactsRef = data.contact || {};

        allContactsArray = Object.entries(contactsRef)
            .map(([id, contact]) => ({ id, ...contact }))
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadAllContactsToAssigned();
};

