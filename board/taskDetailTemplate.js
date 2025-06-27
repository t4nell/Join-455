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
    }
}

/**
 * Closes the task detail template
 *
 * @returns {void} Adds closing animation classes
 */
function closeDetailTemplate() {
    overlay.classList.add('fade_out');
    taskDetailCard.classList.add('closed');
    removeDatePicker('#due_date_edit_task');
}

/**
 * Prevents event propagation when clicking on the card
 *
 * @param {Event} event - Click event object
 * @returns {void} Stops event bubbling
 */
function eventBubbling(event) {
    event.stopPropagation();
}

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
}

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
}

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
}

/**
 * Toggles completion status of a subtask
 *
 * @param {string} taskId - ID of the parent task
 * @param {string} subtaskKey - Key of the subtask to toggle
 * @param {HTMLElement} checkbox - Checkbox element that triggered the toggle
 * @returns {Promise<void>} Updates subtask status in database
 */
async function toggleSubtaskStatus(taskId, subtaskKey, checkbox) {
    const task = allTasks.find((task) => task.id === taskId);
    if (!task || !task.subtasks) return;
    task.subtasks[subtaskKey].done = checkbox.checked;
    const title = task.subtasks[subtaskKey].title;
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}/subtasks/${subtaskKey}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                title: title,
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
    }
}

/**
 * Opens task edit view for specified task
 *
 * @param {string} taskId - ID of the task to edit
 * @returns {Promise<void>} Renders edit form with task data
 */
async function openEditTask(taskId) {
    const task = allTasks.find((task) => task.id === taskId);
    if (task) {
        const taskDetailCard = document.querySelector('.task_detail_card');
        taskDetailCard.innerHTML = getEditTaskTemplate(task);
        initEditTaskVariables();
        await loadContactData();
        loadContactsToAssignedEditTask();
        initializeTextareas();
        if (task.assignedTo) {
            // Check if task has assigned contacts stored by ID
            const assignedContactsIds = Object.keys(task.assignedTo);
            assignedContactsIds.forEach((contactId) => {
                if (
                    task.assignedTo[contactId] === true ||
                    (typeof task.assignedTo[contactId] === 'object' &&
                        Object.values(task.assignedTo[contactId])[0] === true)
                ) {
                    const checkbox = document.getElementById(`users_checkbox_${contactId}_edit_task`);
                    if (checkbox) {
                        checkbox.checked = true;
                        const clickedItem = document.getElementById(`dropdown_item_${contactId}`);
                        if (clickedItem) clickedItem.classList.add('active');
                    }
                }
            });
        }
        switchBtnPriorityEditTask(task.priority);
    }
    initializeCalendar();
}

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
}

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
        allTasks = allTasks.filter((task) => task.id !== taskId);
        closeDetailTemplate();
        renderColumns();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

