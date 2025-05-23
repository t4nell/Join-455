let contactsArray = [];
const groupedContacts = {};
let tasksArray = [];


async function fetchContactData(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    return (responseToJson = await response.json());
  } catch (error) {
    console.error("Error loading contact data:", error);
  }
}


async function loadContactData() {
  await fetchContactData("contact");
  const contactsRef = responseToJson;
  contactsArray = Object.entries(contactsRef).map(([id, contact]) => ({
    ...contact, id
  }));
  console.log(contactsArray);
  
groupContacts(contactsArray);
}

loadTaskData()

async function loadTaskData(){
  await fetchContactData("addTask");
  const tasksRef = responseToJson;
  tasksArray = Object.entries(tasksRef).map(([id, tasks]) => ({
    ...tasks, id
  }));
  console.log(tasksArray);
}







function getRandomUserColor() {
    const randomColorNumber = Math.floor(Math.random() * 20) + 1;
  let randomContactColor = `var(--profile-color-${randomColorNumber})`;
  return randomContactColor;
}

function resetInputFields(){
  document.getElementById('new_contact_name').value = ""
  document.getElementById('new_contact_email').value = ""
  document.getElementById('new_contact_phone').value = ""
}

function clearGroupedContacts(){
  contactsArray = [];

  for (const key in groupedContacts) {
    if(Object.hasOwnProperty.call(groupedContacts, key)) {
      delete groupedContacts[key];
    }
  }
}