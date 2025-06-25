const CATEGORY_COLORS = {
    'User Story': '#FF7A00',        // Orange
    'Technical Task': '#1FD7C1',    // Türkis
    'To Do': '#FC71FF',             // Pink
    'Backlog': '#6E52FF',           // Violett
    'Design': '#FF5EB3',            // Rosa
    'In Progress': '#00BEE8',       // Hellblau
    'In Review': '#9327FF',         // Lila
    'Blocked': '#FF745E',           // Rot
    'Testing': '#FFA35E',           // Hellorange
    'Done': '#2AD300',              // Grün
    'Archived': '#787878'           // Grau
};


/**
 * Gets the color code for a given task category
 * 
 * @param {string} category - Category name of the task
 * @returns {string} Hex color code for the category
 */
function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || '#0052ff';
};


/**
 * Toggles visibility of section buttons based on window width
 * 
 * @returns {void} Updates display style of section buttons
 */
function toggleSectionButton() {
    const sectionButtons = document.querySelectorAll('#section_button_container')
    sectionButtons.forEach(button => {
        if (window.innerWidth < 1345) {
            button.style.display = 'flex'; 
        }else {
            button.style.display = 'none';
        };
    });
};


/**
 * Renders status change dropdown for task cards
 * 
 * @param {Event} event - Click event object
 * @returns {void} Renders status dropdown template
 */
function renderSwapStatusTemplate(event) {
    event.stopPropagation();
    const existingTemplate = document.querySelector('.swap_status_template');
    if (existingTemplate) {
        existingTemplate.remove();
    }
    const taskCard = event.target.closest('.task_card');
    if (!taskCard) return;
    const dragArea = taskCard.closest('.drag_area');
    const status = dragArea ? dragArea.getAttribute('status') : null;
    const taskId = taskCard.getAttribute('data-id');
    const task = allTasks.find(t => t.id === taskId);
    taskCard.insertAdjacentHTML('afterbegin', getSwapStatusTemplate(task));
    const templateElement = taskCard.querySelector('.swap_status_template');
    setStatusButtonVisibility(status, templateElement);
    addCloseSwapStatusListener(templateElement);
};


/**
 * Sets visibility of status buttons based on current task status
 * 
 * @param {string} status - Current status of the task
 * @param {HTMLElement} templateElement - Status dropdown template element
 * @returns {void} Updates button visibility
 */
function setStatusButtonVisibility(status, templateElement) {
    if (status) {
        switch (status) {
            case 'todo':
                templateElement.querySelector('#status_button_todo').style.display = 'none';
                break;
            case 'inProgress':
                templateElement.querySelector('#status_button_in_Progress').style.display = 'none';
                break;
            case 'awaitFeedback':
                templateElement.querySelector('#status_button_await_Feedback').style.display = 'none';
                break;
            case 'done':
                templateElement.querySelector('#status_button_done').style.display = 'none';
                break;
        };
    };
};


/**
 * Updates task status and rerenders board
 * 
 * @param {Event} event - Click event object
 * @param {string} taskId - ID of the task to update
 * @param {string} newStatus - New status to set
 * @returns {void} Updates task status and refreshes display
 */
function changeTaskStatus(event, taskId, newStatus) {
    event.stopPropagation();
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
    };
    updateTaskStatus(taskId, newStatus).then(() => {
        renderColumns();
    });
};


/**
 * Adds click listener to close status dropdown
 * 
 * @param {HTMLElement} templateElement - Status dropdown template element
 * @returns {void} Adds event listener for closing dropdown
 */
function addCloseSwapStatusListener(templateElement) {
    document.addEventListener('click', function closeSwapStatus(e) {
        if (!templateElement.contains(e.target) && !e.target.closest('#section_button')) {
            templateElement.remove();
            document.removeEventListener('click', closeSwapStatus);
        };
    });
};


/**
 * Renders avatar icons for assigned contacts
 * 
 * @param {Object} assignedTo - Object containing assigned contact IDs
 * @returns {string} HTML string of avatar elements
 */
function renderAssignedAvatars(assignedTo) {
    if (!assignedTo) return '';
    const maxVisibleAvatars = 4;
    const assignedContacts = getAssignedContacts(assignedTo);
    let avatarHtml = assignedContacts
        .slice(0, maxVisibleAvatars)
        .map(contact => getAvatarTemplate(contact)).join('');
    if (assignedContacts.length > maxVisibleAvatars) {
        avatarHtml += renderMoreAvatarsButton(assignedContacts.length, maxVisibleAvatars);
    }
    return avatarHtml;
};


/**
 * Gets array of contact objects for assigned contacts
 * 
 * @param {Object} assignedTo - Object containing assigned contact IDs
 * @returns {Array} Array of contact objects with avatar data
 */
function getAssignedContacts(assignedTo) {
    return Object.entries(assignedTo)
        .map(([contactId, isAssigned]) => {
            if (!isAssigned) return null;
            const contact = contactsArray.find(c => c.id === contactId);
            if (!contact) return null;
            return createBatch(contact, contactId);
        })
        .filter(contact => contact !== null);
};


/**
 * Creates contact object with avatar data
 * 
 * @param {Object} contact - Contact data object
 * @param {string} contactId - ID of the contact
 * @returns {Object} Contact object with initials and color
 */
function createBatch(contact, contactId) {
    const nameInitials = contact.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;
    return {
        id: contactId,
        initials,
        color: contact.color
    };
};


/**
 * Calculates subtask completion progress
 * 
 * @param {Object} task - Task object containing subtasks
 * @returns {Object} Progress data with total, completed and percentage
 */
function calculateSubtaskProgress(task) {
    const subtasks = task.subtasks || {};
    const totalSubtasks = Object.keys(subtasks).length;
    const completedSubtasks = Object.values(subtasks).filter(subtask => subtask.done).length;
    return {
        total: totalSubtasks,
        completed: completedSubtasks,
        progressPercentage: totalSubtasks ? (completedSubtasks/totalSubtasks * 100) : 0
    };
};