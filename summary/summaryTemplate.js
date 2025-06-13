/**
 * Creates the HTML template for urgent count display
 * 
 * @param {number} urgentCount - Number of urgent tasks
 * @returns {string} HTML template for urgent count
 */
function getUrgentCountTemplate(urgentCount) {
    return `
        <div class="priority-icon-container">
            <img src="../assets/imgs/addTaskIcons/priorityUrgentIconWhite.svg" 
                 alt="priority icon" class="priority-icon">
        </div>
        <div class="summary_column">
            <span class="summary_number">${urgentCount}</span>
            <span class="summary_text">Urgent</span>
        </div>
    `;
};


/**
 * Gets the HTML template for a notification message
 * 
 * @param {string} message - The message to display
 * @returns {string} HTML template for the notification
 */
function getNotificationTemplate(message) {
    return `<div class="notification">${message}</div>`;
};


/**
 * Gets the mobile greeting HTML template
 * 
 * @param {string} greeting - Greeting message based on time of day
 * @param {string} userName - Name of the current user
 * @returns {string} HTML template for mobile greeting
 */
function getMobileGreetingTemplate(greeting, userName) {
    return `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
};


/**
 * Creates the HTML for the greeting
 * 
 * @param {string} greeting - The greeting based on time of day (e.g. "Good Morning")
 * @param {string} userName - User's name
 * @returns {string} HTML template for the greeting
 */
function getGreetingTemplate(greeting, userName) {
    return `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
};


/**
 * Creates the HTML template for a task group header
 * @param {string} status - The status of the task group
 * @returns {string} HTML template for the task group header
 */
function getTaskGroupHeaderTemplate(status) {
    return `
        <h3>${capitalizeFirstLetter(status)}</h3>
        <div class="task_group_actions">
            <button class="add_task_button" onclick="openTaskModal('${status}')">
                <img src="../assets/imgs/addTaskIcons/plusIcon.svg" alt="Add Task">
            </button>
        </div>
    `;
};


/**
 * Creates the HTML template for a task card
 * @param {Object} task - The task data
 * @returns {string} HTML template for the task card
 */
function getTaskCardTemplate(task) {
    return `
        <div class="task_details">
            <h4 class="task_title">${task.title}</h4>
            <p class="task_description">${task.description}</p>
            <div class="task_meta">
                <span class="task_priority">${task.priority}</span>
                <span class="task_due_date">${formatDate(parseDate(task.dueDate))}</span>
            </div>
        </div>
        <div class="task_actions">
            <button class="edit_task_button" onclick="handleTaskEdit('${task.id}')">
                <img src="../assets/imgs/addTaskIcons/editIcon.svg" alt="Edit Task">
            </button>
            <button class="delete_task_button" onclick="handleTaskDelete('${task.id}')">
                <img src="../assets/imgs/addTaskIcons/trashIcon.svg" alt="Delete Task">
            </button>
        </div>
    `;
};


/**
 * Creates the HTML template for the user profile
 * 
 * @param {string} userName - The name of the user
 * @param {boolean} isGuest - Whether the user is a guest
 * @returns {string} HTML for the user profile
 */
function getUserProfileTemplate(userName, isGuest) {
    return `
        <div class="user_info">
            <span class="user_name">${userName}</span>
            <span class="user_role">${isGuest ? 'Guest' : 'Member'}</span>
        </div>
    `;
};


/**
 * Creates the HTML for a statistic card
 * 
 * @param {number} value - The numerical value to display
 * @param {string} label - The text to display
 * @returns {string} HTML template for the statistic card
 */
function getStatCardTemplate(value, label) {
    return `
        <span class="summary_number">${value}</span>
        <span class="summary_text">${label}</span>
    `;
};


/**
 * Creates the HTML for the urgent tasks card
 * 
 * @param {number} urgentCount - Number of urgent tasks
 * @returns {string} HTML template for the urgent tasks card
 */
function getUrgentCardTemplate(urgentCount) {
    return `
        <div class="priority-icon-container">
            <img src="../assets/imgs/addTaskIcons/priorityUrgentIconWhite.svg" 
                 alt="priority icon" class="priority-icon">
        </div>
        <div class="summary_column">
            <span class="summary_number">${urgentCount}</span>
            <span class="summary_text">Urgent</span>
        </div>
    `;
};