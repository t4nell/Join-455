function deleteContact(contactId) {
    // const delContact = contactId;
    // console.log(delContact);

    // deleteContactData('contact/' + delContact);
    deleteContactAndUpdateTasks(contactId);
}

async function deleteContactData(path = '') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'DELETE',
    });
    if (response.ok) {
        reloadDataAfterDelete();
        return (responseToJson = await response.json());
    } else {
        console.error('Error posting contact data:', response.statusText);
    }
}

async function deleteContactAndUpdateTasks(contactId) {
    const contact = contactsArray.find((contact) => contact.id === contactId);
    if (!contact) {
        console.error('Error');
        return;
    }
    const nameToDelete = `${contact.name} ${contact.surname}`;

    await deleteContactData('contact/' + contactId);

    const response = await fetch(BASE_URL + 'addTask.json');
    const tasksData = await response.json();
    if (!tasksData) return;

    const updateTasks = [];

    const taskEntries = Object.entries(tasksData);

    deleteContactInTasks(taskEntries, nameToDelete, updateTasks);
    await Promise.all(updateTasks);

    await reloadDataAfterDelete();
}

function deleteContactInTasks(taskEntries, nameToDelete, updateTasks) {
  for (let i = 0; i < taskEntries.length; i++) {
    const entry = taskEntries[i];
    const taskId = entry[0];
    const task = entry[1];

    if (task.assignedTo && task.assignedTo[nameToDelete]) {
      delete task.assignedTo[nameToDelete];

      const deleteAssignedTo = fetch(
        `${BASE_URL}addTask/${taskId}/assignedTo/${encodeURIComponent(nameToDelete)}.json`,
        { method: 'DELETE' }
      );
      updateTasks.push(deleteAssignedTo);
    }
  }
}

async function reloadDataAfterDelete() {
    const contactDetailsContainer = document.getElementById('contact_detail_container');
    toggleOverlay();
    showNotification('Contact deleted successfully');
    clearGroupedContacts();
    contactDetailsContainer.classList.add('closed');
    contactDetailsContainer.innerHTML = '';
    await loadContactData();
}