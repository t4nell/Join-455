let contactsArray = [];
const groupedContacts = {};


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


function loadCurrentUser() {
  const currentUserDiv = document.createElement("div");
  currentUserDiv.classList.add("current_user_container");
  currentUserDiv.innerHTML = getCurrentUserTemplate(currentUser, currentUserInitials);
  const contactListContainer = document.getElementById("contact_list_container");
  contactListContainer.appendChild(currentUserDiv);
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