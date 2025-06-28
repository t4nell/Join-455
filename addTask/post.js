BASE_URL_ADDTASK;

/**
 * Extracts task data from a form into a structured object.
 *
 * @param {HTMLFormElement} form - The form containing task input fields.
 * @param {string} boardStatus - The status based on which board section was clicked (todo, inProgress, awaitFeedback).
 * @returns {Object} Task data object with all field values organized for submission.
 */
function collectTaskData(form, boardStatusRequest) {
    const fd = new FormData(form);
    const status = boardStatusRequest;
    const assignedTo = collectAssignedToData();
    const subtasksArray = fd.getAll('subtasks');
    const subtasks = collectSubtaskData(subtasksArray);

    return {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo,
        category: fd.get('category'),
        subtasks,
        status: status,
    };
};


/**
 * Converts an array of subtask titles into an object with structured subtask data.
 *
 * @param {Array<string>} subtasksArray - An array containing the titles of all subtasks.
 * @returns {Object} An object where each key is 'subtask_{index}' and the value is an object with the subtask title and its completion status.
 */
function collectSubtaskData(subtasksArray) {
    const subtasks = {};
    subtasksArray.forEach((subtask, idx) => {
        subtasks[`subtask_${idx}`] = {
            title: subtask,
            done: false,
        };
    });
    return subtasks;
};


/**
 * Collects the assigned users for a task and structures them in an object.
 *
 * @returns {Object} An object where each key is a user ID and the value is an object with the user's full name as key and true as value.
 */
function collectAssignedToData() {
    const assignedTo = {};
    selectedUserIndices.forEach((index) => {
        const contact = allContactsArray[index];
        const { id, name, surname } = contact;
        const fullName = `${name} ${surname}`;
        assignedTo[id] = {
            [fullName]: true,
        };
    });
    return assignedTo;
};


/**
 * Returns the status string for a task based on the provided board status.
 *
 * @param {string} boardStatus - The board section where the task is being created (e.g., 'todo', 'inProgress', 'awaitFeedback').
 * @returns {string} The status string to be used for the task.
 */
function boardStatusRequest(boardStatus) {
    let status;
    switch (boardStatus) {
        case 'inProgress':
            status = 'inProgress';
            break;
        case 'awaitFeedback':
            status = 'awaitFeedback';
            break;
        case 'todo':
        default:
            status = 'todo';
            break;
    }
    return status;
};


/**
 * Sends task data to the server for saving.
 *
 * @param {Object} taskData - The task object to be posted.
 * @returns {void} Posts the task data to the database.
 */
function postTask(taskData) {
    postData('addTask', taskData);
};


/**
 * Sends data to the server via a POST request.
 *
 * @param {string} path - API endpoint path, defaults to empty string.
 * @param {Object} data - Data object to send to the server, defaults to empty object.
 * @returns {Promise<Object>} Response data from the server as JSON.
 */
async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL_ADDTASK + path + '.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
};


