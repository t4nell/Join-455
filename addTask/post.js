BASE_URL_ADDTASK;

/**
 * Extracts task data from a form into a structured object.
 * 
 * @param {HTMLFormElement} form - The form containing task input fields.
 * @returns {Object} Task data object with all field values organized for submission.
 */
function collectTaskData(form) {
    const fd = new FormData(form);
    const subtasksArray = fd.getAll('subtasks');
    const todo = 'todo';

    const assignedTo = {};
    selectedUserIndices.forEach((index) => {
        const contact = allContactsArray[index];
        const { id, name, surname } = contact;
        const fullName = `${name} ${surname}`;

        assignedTo[id] = {
            [fullName]: true,
        };
    });

    const subtasks = {};
    subtasksArray.forEach((subtask, idx) => {
        subtasks[`subtask_${idx}`] = {
            title: subtask,
            done: false,
        };
    });

    return {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo,
        category: fd.get('category'),
        subtasks,
        status: todo,
    };
}

/**
 * Sends task data to the server for saving.
 * 
 * @param {Object} taskData - The task object to be posted.
 * @returns {void} Posts the task data to the database.
 */
function postTask(taskData) {
    postData('addTask', taskData);
}

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
}

