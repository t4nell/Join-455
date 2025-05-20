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
    const deleteNotification = document.getElementById('contact_notification');
    const contactDetailsContainer = document.getElementById("contact_detail_container");
    deleteNotification.innerHTML = `<p>Contact successfully deleted</p>`
    deleteNotification.classList.remove('closed');
    clearGroupedContacts();
    contactDetailsContainer.classList.add("closed");
    contactDetailsContainer.innerHTML = "";
    await loadContactData();
      setTimeout(() => {
    document.getElementById('contact_notification').classList.add('closed');
  }, 3000);
  }

