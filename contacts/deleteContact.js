function deleteContact(contactId){
    const delContact = contactId
    console.log(delContact);

    deleteContactData("contact/" + delContact)
}

async function deleteContactData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  if (response.ok) {
    reloadDataAfterDelete();
    return (responseToJson = await response.json());
  } else {
    console.error("Error posting contact data:", response.statusText);
  }
  }

  async function reloadDataAfterDelete(){

    const contactDetailsContainer = document.getElementById("contact_detail_container");
    toggleOverlay();
    showNotification('Contact deleted successfully')
    clearGroupedContacts();
    contactDetailsContainer.classList.add("closed");
    contactDetailsContainer.innerHTML = "";
    await loadContactData();
  }

