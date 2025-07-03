let menu, selectedUser, dropdown, toggle;
let contactsArray = [];

/**
 * Initializes variables and elements needed for task editing
 *
 * @returns {void} Sets up global variables and references to DOM elements
 */
function initEditTaskVariables() {
    dropdown = document.getElementById('dropdown_edit_task');
    selectedUser = document.getElementById('selected_user_group_edit_task');
    menu = document.getElementById('dropdown_menu_edit_task');
    toggle = document.getElementById('dropdown_toggle_btn_edit_task');
};


/**
 * Initializes datepicker calendar for task due dates
 *
 * @returns {void} Sets up calendar with default configuration and event listeners
 */
function initializeCalendar() {
    const calendarInput = document.getElementById('due_date_edit_task');
    if (calendarInput && !calendarInput._flatpickr) {
        flatpickr(calendarInput, {
            dateFormat: 'd/m/Y',
            minDate: 'today',
            locale: {
                firstDayOfWeek: 1,
            },
        });
    };
};


/**
 * Destroys a Flatpickr instance associated with the specified selector.
 *
 * @param {string} selector - CSS selector of the input element with attached Flatpickr.
 * @returns {void} Removes the datepicker from the element.
 */
function removeDatePicker(selector) {
    const element = document.querySelector(selector);
    if (element && element._flatpickr) {
        element._flatpickr.destroy();
    };
};


/**
 * Opens the calendar widget for date selection
 *
 * @returns {void} Triggers the flatpickr calendar to open
 */
function openCalendarEditTask() {
    const calenderInput = document.getElementById('due_date_edit_task');
    if (calenderInput && calenderInput._flatpickr) {
        calenderInput._flatpickr.open();
    } else {
        console.error('Flatpickr not initialized');
    };
};


/**
 * Loads and processes contact data from the server, updates contactsArray and populates the assigned contacts dropdown
 *
 * @param {string} path - Optional path parameter for the API endpoint
 * @returns {Promise<void>} Loads contacts and updates contactsArray
 */
async function loadContactData(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseToJson = await response.json();
        const contactsRef = responseToJson.contact;
        const addTask = Object.values(responseToJson.addTask);
        transformContacts(contactsRef);
        contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadContactsToAssignedEditTask();
};


/**
 * Transforms the contacts reference object into an array of contact objects with IDs.
 *
 * @param {Object} contactsRef - Object containing contact data keyed by ID
 * @returns {void} Updates the global contactsArray with formatted contact objects
 */
function transformContacts(contactsRef) {
    contactsArray = Object.entries(contactsRef).map(([id, contact]) => ({
        ...contact,
        id,
    }));
};


/**
 * Updates priority button icons based on selected priority
 *
 * @param {string} btnPriority - Selected priority ('Urgent', 'Medium', 'Low')
 * @returns {void} Updates priority icon sources
 */
function switchBtnPriorityEditTask(btnPriority) {
    document.getElementById('icon_urgent_edit_task').src = '../assets/imgs/boardIcons/priorityUrgent.svg';
    document.getElementById('icon_medium_edit_task').src = '../assets/imgs/boardIcons/priorityMedium.svg';
    document.getElementById('icon_low_edit_task').src = '../assets/imgs/boardIcons/priorityLow.svg';
    updateTaskPriorityIcon(btnPriority);
};


/**
 * Updates the icon of the selected priority button to the white version.
 *
 * @param {string} btnPriority - Selected priority ('Urgent', 'Medium', 'Low')
 * @returns {void} Updates the icon source for the selected priority
 */
function updateTaskPriorityIcon(btnPriority) {
    switch (btnPriority) {
        case 'Urgent':
            document.getElementById('icon_urgent_edit_task').src =
                '../assets/imgs/boardIcons/priorityUrgentIconWhite.svg';
            break;
        case 'Medium':
            document.getElementById('icon_medium_edit_task').src =
                '../assets/imgs/boardIcons/priorityMediumIconWhite.svg';
            break;
        case 'Low':
            document.getElementById('icon_low_edit_task').src = '../assets/imgs/boardIcons/priorityLowIconWhite.svg';
            break;
    };
};


/**
 * Toggles the assigned contacts dropdown visibility
 *
 * @param {Event} event - Click event object
 * @returns {void} Toggles dropdown classes
 */
function toggleDropdownAssignedEditTask(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
    updateAssignedContacts();
};


/**
 * Updates the assigned contacts display in the edit task view
 *
 * @returns {void} Updates the selectedUser element with the current assigned contacts
 */
function updateAssignedContacts() {
    const assignedTo = {};
    const checkboxes = document.querySelectorAll('input[name="assigned_to"]:checked');
    checkboxes.forEach((checkbox) => {
        const contactId = checkbox.closest('.dropdown_item').id.replace('dropdown_item_', '');
        assignedTo[contactId] = true;
    });
    selectedUser.innerHTML = renderAssignedContactsEditTask(assignedTo);
};


/**
 * Returns the initials for a contact's name and surname.
 *
 * @param {Object} contact - Contact object containing name and surname
 * @returns {Object} Object with nameInitials and surnameInitials
 */
function getInitials(contact) {
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    return { nameInitials, surnameInitials };
};


/**
 * Toggles the background of a selected contact in dropdown
 *
 * @param {number} index - Index of the clicked contact item
 * @returns {void} Toggles active class on contact item
 */
function toggleBackgroundEditTask(index) {
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    clickedItem.classList.toggle('active');
};


/**
 * Handles clicks outside the dropdown to close it
 *
 * @param {Event} event - Click event object
 * @returns {void} Closes dropdown if click is outside
 */
function handleClickOutsideEditTask(event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
        updateAssignedContacts();
    };
};


/**
 * Loads contacts into the assigned contacts dropdown
 *
 * @returns {void} Populates dropdown menu with contacts
 */
function loadContactsToAssignedEditTask() {
    if (!menu) return;
    menu.innerHTML = '';
    contactsArray.forEach((contact) => {
        menu.innerHTML += loadContactsToAssignedTemplateEditTask(contact);
    });
};


/**
 * Generates HTML template for a contact in the dropdown
 *
 * @param {Object} contact - Contact object containing user information
 * @returns {string} HTML string for contact list item
 */
function loadContactsToAssignedTemplateEditTask(contact) {
    const bgColor = contact.color;
    const { nameInitials, surnameInitials } = getInitials(contact);
    const isSelected = document.getElementById(`selected_user_${contact.id}`) !== null;
    const checkedAttr = isSelected ? 'checked' : '';
    const activeClass = isSelected ? 'active' : '';
    return createContactListItem(activeClass, contact, bgColor, nameInitials, surnameInitials, checkedAttr);
};


/**
 * Generates HTML for assigned contact badges.
 *
 * @param {Array} assignedEntries - Array of assigned contact entries
 * @returns {string} HTML string of contact badges
 */
function generateAssignedContactBadges(assignedEntries) {
    return assignedEntries
        .map(([contactId]) => {
            const contact = contactsArray.find((c) => c.id === contactId);
            if (!contact) return '';
            const initials = getContactInitials(contact);
            return generateContactBadge(contactId, contact, initials);
        })
        .join('');
};


/**
 * Returns the initials string for a contact's name and surname.
 *
 * @param {Object} contact - Contact object containing name and surname
 * @returns {string} Initials string (e.g. "JD" for John Doe)
 */
function getContactInitials(contact) {
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
 * Renders assigned contacts in the edit task view
 *
 * @param {Object} assignedTo - Object containing assigned contact information
 * @returns {string} HTML string of assigned contact badges
 */
function renderAssignedContactsEditTask(assignedTo) {
    if (!assignedTo) return '';
    const assignedEntries = Object.entries(assignedTo).filter(([_, isAssigned]) => isAssigned);
    const maxVisible = 4;
    let html = generateAssignedContactBadges(assignedEntries.slice(0, maxVisible));
    if (assignedEntries.length > maxVisible) {
        html += renderMoreContactsBatch(assignedEntries.length, maxVisible);
    }
    return html;
};


/**
 * Renders a batch showing the number of additional contacts not displayed
 *
 * @param {number} totalContacts - Total number of contacts assigned
 * @param {number} maxVisible - Maximum number of contacts to display
 * @returns {string} HTML string for the "more" batch
 */
function renderMoreContactsBatch(totalContacts, maxVisible) {
    return `
        <div class="avatar more_avatar">
            +${totalContacts - maxVisible}
        </div>
    `;
};


/**
 * Handles user selection in the contacts dropdown
 *
 * @param {string} id - Contact ID
 * @param {Event} event - Click event object
 * @returns {void} Updates selected contacts display
 */
function selectUserEditTask(id, event) {
    initEditTaskVariables();
    event.stopPropagation();
    const checkbox = document.getElementById(`users_checkbox_${id}_edit_task`);
    const clickedItem = document.getElementById(`dropdown_item_${id}`);
    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }
    const contact = contactsArray.find((c) => c.id === id);
    if (!contact) return;
    toggleUserSelection(checkbox, contact, clickedItem, id);
};


/**
 * Toggles the selection state of a contact in the dropdown and updates the UI.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element for the contact
 * @param {Object} contact - Contact object containing user information
 * @param {HTMLElement} clickedItem - The dropdown item element that was clicked
 * @param {string} id - Contact ID
 * @returns {void} Updates the selected contacts display and dropdown item state
 */
function toggleUserSelection(checkbox, contact, clickedItem, id) {
    if (checkbox.checked) {
        addSelectedUserIconEditTask(contact);
        clickedItem.classList.add('active');
    } else {
        removeSelectedUserEditTask(id);
        clickedItem.classList.remove('active');
    };
};


/**
 * Removes a selected user from the assigned contacts
 *
 * @param {string} id - Contact ID to remove
 * @returns {void} Removes contact from selection
 */
function removeSelectedUserEditTask(id) {
    const userIconContainer = document.getElementById(`selected_user_${id}`);
    if (userIconContainer) {
        userIconContainer.remove();
    };
};


/**
 * Adds a selected user icon to the assigned contacts display
 *
 * @param {Object} contact - Contact object to add
 * @returns {void} Adds contact icon to selection
 */
function addSelectedUserIconEditTask(contact) {
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;
    selectedUser.innerHTML += addSelectedUserIconTemplate(contact.id, contact.color, initials);
};


/**
 * Renders editable subtask elements
 *
 * @param {Object} task - Task object containing subtasks
 * @returns {string} HTML string of editable subtask elements
 */
function renderEditableSubtasks(task) {
    if (!task.subtasks) return '';
    return Object.entries(task.subtasks)
        .map(([subtaskId, subtask]) => {
            const subtaskNumber = subtaskId.split('_')[1];
            const tagId = `tag_field_${subtaskNumber}`;
            const tagInputId = `new_tag_input_${subtaskNumber}`;
            const tagBtnConId = `new_tag_btn_container_${subtaskNumber}`;
            return renderSubtaskElement(tagId, tagInputId, tagBtnConId, subtask);
        })
        .join('');
};


/**
 * Collects all updated data for the task and returns the updated task object.
 *
 * @param {string} taskId - ID of the task being edited
 * @returns {Object} Updated task object
 */
function getUpdatedTaskData(taskId) {
    const { currentTask, formData, assignedTo } = contactsCollects(taskId);
    let { subtaskIndex, subtasks } = subtasksCollect(currentTask);
    newSubtask(subtaskIndex, subtasks);
    return createUpdatedTaskObject(formData, currentTask, assignedTo, subtasks);
};


/**
 * Updates the task in the allTasks array and refreshes the UI.
 *
 * @param {string} taskId - ID of the task being edited
 * @param {Object} updatedTask - Updated task object
 * @returns {void}
 */
function updateTaskInUI(taskId, updatedTask) {
    const taskIndex = allTasks.findIndex((task) => task.id === taskId);
    allTasks[taskIndex] = { ...updatedTask, id: taskId };
    closeDetailTemplate();
    renderColumns();
};


/**
 * Saves changes made to a task
 *
 * @param {string} taskId - ID of the task being edited
 * @returns {Promise<void>} Updates task in database and UI
 */
async function saveEditTask(taskId) {
    try {
        const updatedTask = getUpdatedTaskData(taskId);
        const response = await firebaseUpdate(taskId, updatedTask);
        validateUpdateResponse(response);
        updateTaskInUI(taskId, updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
    }
    removeDatePicker('#due_date_edit_task');
};


/**
 * Validates the response from the update request and throws an error if the update failed.
 *
 * @param {Response} response - The response object from the update request
 * @returns {void} Throws an error if the response is not ok
 */
function validateUpdateResponse(response) {
    if (!response.ok) {
        throw new Error('Failed to update task');
    };
};


/**
 * Updates task data in Firebase
 *
 * @param {string} taskId - ID of the task to update
 * @param {Object} updatedTask - New task data
 * @returns {Promise<Response>} Firebase update response
 */
async function firebaseUpdate(taskId, updatedTask) {
    return await fetch(`${BASE_URL}addTask/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


/**
 * Creates updated task object with form data
 *
 * @param {FormData} formData - Form data from edit form
 * @param {Object} currentTask - Current task data
 * @param {Object} assignedTo - Updated assigned contacts
 * @param {Object} subtasks - Updated subtasks
 * @returns {Object} Updated task object
 */
function createUpdatedTaskObject(formData, currentTask, assignedTo, subtasks) {
    return {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('due_date'),
        priority: formData.get('priority'),
        category: currentTask.category,
        assignedTo: assignedTo,
        subtasks: subtasks,
        status: currentTask.status,
    };
};


/**
 * Adds new subtask to subtasks object
 *
 * @param {number} subtaskIndex - Index for new subtask
 * @param {Object} subtasks - Current subtasks object
 * @returns {void} Updates subtasks object with new subtask
 */
function newSubtask(subtaskIndex, subtasks) {
    const newSubtaskInput = document.getElementById('tag_input_field_edit_task');
    if (newSubtaskInput && newSubtaskInput.value.trim()) {
        const newSubtaskKey = `subtask_${subtaskIndex}`;
        subtasks[newSubtaskKey] = {
            title: newSubtaskInput.value.trim(),
            done: false,
        };
    };
};


/**
 * Collects and processes subtask data
 *
 * @param {Object} currentTask - Current task data
 * @returns {Object} Object containing subtask index and updated subtasks
 */
function subtasksCollect(currentTask) {
    const subtaskInputs = document.querySelectorAll('textarea[name="subtasks"]');
    const subtasks = {};
    let subtaskIndex = 0;
    subtaskIndex = collectSubtasks(subtaskInputs, subtaskIndex, currentTask, subtasks);
    return { subtaskIndex, subtasks };
};


/**
 * Iterates over subtask input fields and collects their data into the subtasks object.
 *
 * @param {NodeList} subtaskInputs - List of textarea elements for subtasks
 * @param {number} subtaskIndex - Current index for subtasks
 * @param {Object} currentTask - Current task data (used to preserve subtask status)
 * @param {Object} subtasks - Object to store collected subtasks
 * @returns {number} The updated subtask index after collecting all subtasks
 */
function collectSubtasks(subtaskInputs, subtaskIndex, currentTask, subtasks) {
    subtaskInputs.forEach((input) => {
        if (input.value.trim()) {
            const subtaskKey = `subtask_${subtaskIndex}`;
            const existingSubtask = currentTask.subtasks ? currentTask.subtasks[subtaskKey] : null;
            subtasks[subtaskKey] = {
                title: input.value,
                done: existingSubtask ? existingSubtask.done : false,
            };
            subtaskIndex++;
        }
    });
    return subtaskIndex;
};


/**
 * Collects and processes contact assignments
 *
 * @param {string} taskId - ID of the task being edited
 * @returns {Object} Object containing task data, form data, and assigned contacts
 */
function contactsCollects(taskId) {
    const form = document.getElementById('edit_task_form');
    const formData = new FormData(form);
    const currentTask = allTasks.find((task) => task.id === taskId);
    const assignedTo = {};
    const checkboxes = document.querySelectorAll('input[name="assigned_to"]:checked');
    collectAssignedContacts(checkboxes, assignedTo);
    return { currentTask, formData, assignedTo };
};


/**
 * Collects assigned contacts from checked checkboxes and adds them to the assignedTo object.
 *
 * @param {NodeList} checkboxes - List of checked contact checkboxes
 * @param {Object} assignedTo - Object to store assigned contacts
 * @returns {void} Populates assignedTo with selected contacts
 */
function collectAssignedContacts(checkboxes, assignedTo) {
    checkboxes.forEach((checkbox) => {
        const contactId = checkbox.closest('.dropdown_item').id.replace('dropdown_item_', '');
        const contact = contactsArray.find((c) => c.id === contactId);
        if (contact) {
            const fullName = `${contact.name} ${contact.surname}`;
            assignedTo[contactId] = {
                [fullName]: true,
            };
        }
    });
};