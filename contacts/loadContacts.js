let contactsArray = [];
const groupedContacts = {};
let tasksArray = [];


/**
 * Fetches contact data from the server.
 *
 * @param {string} [path=""] - The path to the contact data to be fetched.
 * @return {*} - Returns the response from the server after fetching contact data.
 * @throws Will log an error if the fetch operation fails.
 * @returns {void}
 */
async function fetchContactData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
  } catch (error) {
    console.error("Error loading contact data:", error);
  }
}


/**
 * Groups contacts by their first letter and stores them in the groupedContacts object.
 *
 * @returns {void}
 */
async function loadContactData() {
  await fetchContactData("contact");
  const contactsRef = responseToJson;
  contactsArray = Object.entries(contactsRef).map(([id, contact]) => ({
    ...contact, id
  }));
groupContacts(contactsArray);
}


/**
 * Groups contacts by the first letter of their names.
 *
 * @returns {void}
 */
async function loadTaskData(){
  await fetchContactData("addTask");
  const tasksRef = responseToJson;
  tasksArray = Object.entries(tasksRef).map(([id, tasks]) => ({
    ...tasks, id
  }));
}


/**
 * Creates random user colors by generating a random number between 1 and 20, which corresponds to predefined CSS variables for colors.
 *
 * @return {*} - Returns a string representing a random user color in the format of a CSS variable.
 */
function getRandomUserColor() {
    const randomColorNumber = Math.floor(Math.random() * 20) + 1;
  let randomContactColor = `var(--profile-color-${randomColorNumber})`;
  return randomContactColor;
}


/**
 * Resets the input fields in the new contact form by clearing their values.
 *
 * @returns {void}
 */
function resetInputFields(){
  document.getElementById('new_contact_name').value = ""
  document.getElementById('new_contact_email').value = ""
  document.getElementById('new_contact_phone').value = ""
}


/**
 * Clears the contacts array and resets the groupedContacts object.
 *
 * @returns {void}
 */
function clearGroupedContacts(){
  contactsArray = [];
  for (const key in groupedContacts) {
    if(Object.hasOwnProperty.call(groupedContacts, key)) {
      delete groupedContacts[key];
    }
  }
}