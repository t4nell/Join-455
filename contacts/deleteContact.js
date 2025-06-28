/**
 * Deletes contact data from the server and updates the UI accordingly.
 *
 * @param {string} [path=''] - The path to the contact data to be deleted.
 * @return {*} - Returns the response from the server after deletion.
 */
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


/**
 * Deletes a contact and updates tasks associated with that contact.
*
 * @description This function finds the contact by ID, deletes it, and then updates tasks that were assigned to that contact.
 * @param {*} contactId - The ID of the contact to be deleted.
 * @return {*} - Returns a promise that resolves when the contact and tasks are updated.
 */
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


/**
 * Deletes the contact from all tasks where it was assigned.
 *
 * @param {*} taskEntries - An array of task entries, where each entry is an array containing the task ID and the task object.
 * @description This function iterates through all tasks and removes the contact from the assignedTo field if it exists.
 * @param {*} nameToDelete - The name of the contact to be deleted from tasks.
 * @param {*} updateTasks - An array to hold promises for updating tasks in the backend.
 * @returns {void}
 */
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


/**
 * Reloads the contact data after a contact has been deleted.
 *
 * @returns {void}
 */
async function reloadDataAfterDelete() {
    const contactDetailsContainer = document.getElementById('contact_detail_container');
    toggleOverlay();
    showNotification('Contact deleted successfully');
    clearGroupedContacts();
    contactDetailsContainer.classList.add('closed');
    contactDetailsContainer.innerHTML = '';
    closeContactMain();
    await loadContactData();
}