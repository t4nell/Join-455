/**
 * Displays the task detail template for a specific task
 *
 * @param {string} taskId - ID of the task to display
 * @returns {void} Updates DOM with task detail card
 */
function renderDetailTemplate(taskId) {
    const task = allTasks.find((task) => task.id === taskId);
    if (task) {
        taskDetailCard.innerHTML = getDetailTaskCard(task);
        overlay.classList.remove('fade_out');
        taskDetailCard.classList.remove('closed');
    };
};


/**
 * Closes the task detail template
 *
 * @returns {void} Adds closing animation classes
 */
function closeDetailTemplate() {
    overlay.classList.add('fade_out');
    taskDetailCard.classList.add('closed');
    removeDatePicker('#due_date_edit_task');
};


/**
 * Prevents event propagation when clicking on the card
 *
 * @param {Event} event - Click event object
 * @returns {void} Stops event bubbling
 */
function eventBubbling(event) {
    event.stopPropagation();
};


/**
 * Renders assigned contacts for task detail view
 *
 * @param {Object} assignedTo - Object containing assigned contact IDs
 * @returns {string} HTML string of assigned contacts
 */
function renderAssignedContacts(assignedTo) {
    if (!assignedTo) return '';
    return Object.entries(assignedTo)
        .map(([contactId, isAssigned]) => {
            if (!isAssigned) return '';
            const contact = contactsArray.find((c) => c.id === contactId);
            if (!contact) return '';
            const initials = getBatch(contact);
            return getAssignedContactsTemplate(contactId, contact, initials);
        })
        .join('');
};


/**
 * Creates initials from contact name
 *
 * @param {Object} contact - Contact object with name and surname
 * @returns {string} Combined initials from first and last name
 */
function getBatch(contact) {
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;
    return initials;
};


/**
 * Renders list of subtasks for task detail view
 *
 * @param {Object} subtasks - Object containing subtask data
 * @param {string} taskId - ID of the parent task
 * @returns {string} HTML string of subtask list
 */
function renderSubtasksList(subtasks, taskId) {
    if (!subtasks) return '';
    return Object.entries(subtasks)
        .map(([key, subtask]) => getSubtaskTemplate(key, subtask, taskId))
        .join('');
};


/**
 * Updates the completion status of a subtask in the local task object.
 *
 * @param {string} taskId - ID of the parent task
 * @param {string} subtaskKey - Key of the subtask to toggle
 * @param {boolean} checked - New checked state of the subtask
 * @returns {Object|null} Object with updated task and subtask title, or null if not found
 */
function updateSubtaskStatusLocally(taskId, subtaskKey, checked) {
    const task = allTasks.find((task) => task.id === taskId);
    if (!task || !task.subtasks) return null;
    task.subtasks[subtaskKey].done = checked;
    const title = task.subtasks[subtaskKey].title;
    return { task, title };
};


/**
 * Toggles completion status of a subtask and updates the database.
 *
 * @param {string} taskId - ID of the parent task
 * @param {string} subtaskKey - Key of the subtask to toggle
 * @param {HTMLElement} checkbox - Checkbox element that triggered the toggle
 * @returns {Promise<void>} Updates subtask status in database
 */
async function toggleSubtaskStatus(taskId, subtaskKey, checkbox) {
    const result = updateSubtaskStatusLocally(taskId, subtaskKey, checkbox.checked);
    if (!result) return;
    await updateSubtaskStatus(taskId, subtaskKey, result, checkbox);
};


/**
 * Updates the subtask status in the database and handles UI updates or errors.
 *
 * @param {string} taskId - ID of the parent task
 * @param {string} subtaskKey - Key of the subtask to update
 * @param {Object} result - Object containing updated task and subtask title
 * @param {HTMLElement} checkbox - Checkbox element that triggered the update
 * @returns {Promise<void>} Updates subtask status in database and UI
 */
async function updateSubtaskStatus(taskId, subtaskKey, result, checkbox) {
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}/subtasks/${subtaskKey}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                title: result.title,
                done: checkbox.checked,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to update subtask status');
        renderColumns();
    } catch (error) {
        console.error('Error updating subtask:', error);
        checkbox.checked = !checkbox.checked;
    };
};


/**
 * Sets up the edit form UI for the given task (checkboxes, assigned contacts, priority button).
 *
 * @param {Object} task - Task object to edit
 * @returns {void} Updates UI elements for editing
 */
function renderEditTaskTemplate(task) {
    const taskDetailCard = document.querySelector('.task_detail_card');
    taskDetailCard.innerHTML = getEditTaskTemplate(task);
    initEditTaskVariables();
};


/**
 * Sets up the edit form UI for the given task (checkboxes, assigned contacts, priority button).
 *
 * @param {Object} task - Task object to edit
 * @returns {void} Updates UI elements for editing
 */
function setupEditTaskUI(task) {
    loadContactsToAssignedEditTask();
    initializeTextareas();
    if (task.assignedTo) {
        const assignedContactsIds = Object.keys(task.assignedTo);
        assignedContactsIds.forEach((contactId) => {
            initializeAssignedContactCheckbox(task, contactId);
        });
    }
    switchBtnPriorityEditTask(task.priority);
};


function initializeAssignedContactCheckbox(task, contactId) {
    if (task.assignedTo[contactId] === true ||
        (typeof task.assignedTo[contactId] === 'object' &&
            Object.values(task.assignedTo[contactId])[0] === true)) {
        const checkbox = document.getElementById(`users_checkbox_${contactId}_edit_task`);
        if (checkbox) {
            checkbox.checked = true;
            const clickedItem = document.getElementById(`dropdown_item_${contactId}`);
            if (clickedItem) clickedItem.classList.add('active');
        };
    };
};


/**
 * Opens task edit view for specified task and initializes all required data.
 *
 * @param {string} taskId - ID of the task to edit
 * @returns {Promise<void>} Renders edit form with task data and loads contacts
 */
async function openEditTask(taskId) {
    const task = allTasks.find((task) => task.id === taskId);
    if (task) {
        renderEditTaskTemplate(task);
        await loadContactData();
        setupEditTaskUI(task);
    }
    initializeCalendar();
};


/**
 * Initializes auto-resize behavior for textareas
 *
 * @returns {void} Sets up textarea resize listeners
 */
function initializeTextareas() {
    const textareas = document.querySelectorAll('textarea.new_tag_input');
    textareas.forEach((textarea) => {
        autoResizeTextareaEditTask(textarea);
    });
};


/**
 * Deletes a task from the board
 *
 * @param {string} taskId - ID of the task to delete
 * @returns {Promise<void>} Removes task from database and UI
 */
async function deleteTask(taskId) {
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        removeTaskFromList(taskId);
    } catch (error) {
        console.error('Error deleting task:', error);
    };
};


/**
 * Removes the deleted task from the local task list and updates the UI.
 *
 * @param {string} taskId - ID of the task to remove
 * @returns {void} Removes task from allTasks, closes detail view, and re-renders columns
 */
function removeTaskFromList(taskId) {
    allTasks = allTasks.filter((task) => task.id !== taskId);
    closeDetailTemplate();
    renderColumns();
};