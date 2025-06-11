const greetingContainer = document.getElementById('summary_greating_container');
const headerContainer = document.getElementById('header_container');
const mainContainer = document.getElementById('navbar_container');
const STATUS_MAPPINGS = {
    todo: ['todo'],
    done: ['done'],
    inProgress: ['inprogress', 'in progress'],
    awaitingFeedback: ['awaitfeedback', 'awaitingfeedback', 'await feedback']
};

/**
 * Returns appropriate greeting based on time of day
 * @param {number} hours - Current hour (0-23)
 * @returns {string} Appropriate greeting message
 */
function getGreeting(hours) {
    if (hours >= 0 && hours < 10) {
        return 'Guten Morgen';
    } else if (hours >= 10 && hours < 19) {
        return 'Guten Tag';
    } else {
        return 'Guten Abend';
    }
}

/**
 * Creates the HTML for the greeting
 * @param {string} greeting - The greeting based on time of day (e.g. "Good Morning")
 * @param {string} userName - User's name
 * @returns {string} HTML template for the greeting
 */
function getGreetingTemplate(greeting, userName) {
    return `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
}

/**
 * Updates the greeting with the current user's name
 */
function updateGreeting() {
    const now = new Date();
    const greeting = getGreeting(now.getHours());
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.name || 'Gast';
    greetingContainer.innerHTML = getGreetingTemplate(greeting, userName);
}

/**
 * Creates the HTML for a statistic card
 * @param {number} value - The numerical value to display
 * @param {string} label - The text to display
 * @returns {string} HTML template for the statistic card
 */
function getStatCardTemplate(value, label) {
    return `
        <span class="summary_number">${value}</span>
        <span class="summary_text">${label}</span>
    `;
}

/**
 * Updates a statistic card with new values
 * @param {string} containerId - ID of the container element
 * @param {number} value - The numerical value to display
 * @param {string} label - The text to display
 */
function updateStatCard(containerId, value, label) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = getStatCardTemplate(value, label);
}

/**
 * Creates the HTML for the urgent tasks card
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
}

/**
 * Updates the urgent tasks card
 * @param {number} urgentCount - Number of urgent tasks
 */
function updateUrgentCard(urgentCount) {
    const container = document.getElementById('summary_importance_container');
    
    if (!container) return;
    container.innerHTML = getUrgentCardTemplate(urgentCount);
}

/**
 * Creates the HTML for the deadline card
 * @param {Object|null} nextUrgentTask - The next urgent task or null
 * @returns {string} HTML template for the deadline card
 */
function getDeadlineCardTemplate(nextUrgentTask) {
    let deadlineText;
    
    if (nextUrgentTask && nextUrgentTask.dueDate) {
        const dateObject = parseDate(nextUrgentTask.dueDate);
        deadlineText = formatDate(dateObject);
    } else {
        deadlineText = 'No urgent deadlines';
    }
    return `
        <span class="summary_date">${deadlineText}</span>
        <span class="summary_text">Upcoming Deadline</span>
    `;
}

/**
 * Updates the deadline card with the due date of the next urgent task
 * @param {Object|null} nextUrgentTask - The next urgent task or null
 */
function updateDeadlineCard(nextUrgentTask) {
    const container = document.getElementById('summary_deadline_container');
    
    if (!container) return;
    container.innerHTML = getDeadlineCardTemplate(nextUrgentTask);
}

/**
 * Updates all summary UI elements with task statistics
 * @param {Object} stats - Object containing all task statistics
 */
function updateSummaryUI(stats) {
    updateStatCard('summary_todo_container', stats.todo, 'To-do');
    updateStatCard('summary_done_container', stats.done, 'Done');
    updateStatCard('summary_tasks_board_container', stats.totalTasks, 'Tasks in Board');
    updateStatCard('summary_tasks_progress_container', stats.inProgress, 'Tasks In Progress');
    updateStatCard('summary_await_feedback_container', stats.awaitingFeedback, 'Awaiting Feedback');

    updateUrgentCard(stats.urgent);
    updateDeadlineCard(stats.nextUrgentTask);
}

/**
 * Formats a Date object into a readable date string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "May 21, 2025")
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Notification template object that handles notification creation and display
 */
const NotificationTemplate = {
    /**
     * Creates the HTML content for a notification
     * @param {string} message - The message to display
     * @returns {string} HTML for the notification
     */
    getHTML: function(message) {
        return `<div class="notification">${message}</div>`;
    },
    
    /**
     * Renders a notification and handles its lifecycle
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the notification in ms (default: 3000)
     */
    render: function(message, duration = 3000) {
        const container = document.createElement('div');
        container.id = 'notification-container-' + Date.now();
        container.innerHTML = this.getHTML(message);
        document.body.appendChild(container);
        
        setTimeout(function() {
            container.remove();
        }, duration);
    }
};

/**
 * Shows a notification that disappears after a few seconds
 * @param {string} message - The message to display
 */
function showNotification(message) {
    NotificationTemplate.render(message);
}

/**
 * Returns an array of container IDs that should be clickable
 * @returns {Array<string>} Array of container IDs
 */
function getClickableContainerIds() {
    return [
        'summary_todo_container',
        'summary_done_container',
        'summary_section2_container',
        'summary_tasks_board_container',
        'summary_tasks_progress_container',
        'summary_await_feedback_container'
    ];
}

/**
 * Makes a container element clickable and adds styling
 * @param {HTMLElement} containerElement - The container element to make clickable
 */
function makeContainerClickable(containerElement) {
    if (!containerElement) return;

    containerElement.classList.add('clickable-container');
    containerElement.onclick = navigateToBoard;
}

/**
 * Navigates to the board page
 */
function navigateToBoard() {
    window.location.href = '../board/board.html';
}

/**
 * Makes all summary containers clickable
 */
function makeContainersClickable() {
    const containerIds = getClickableContainerIds();
    
    for (let containerId of containerIds) {
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.querySelector('.' + containerId);
        }
        if (container) {
            makeContainerClickable(container);
        }
    }
}

/**
 * Renders the header using template
 * @returns {void}
 */
function renderHeader() {
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * Renders the sidebar using template
 * @returns {void}
 */
function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}

/**
 * Creates the HTML for the mobile greeting
 * @param {string} greeting - The greeting based on time of day
 * @param {string} userName - User's name
 * @returns {string} HTML template for the mobile greeting
 */
function getMobileGreetingTemplate(greeting, userName) {
    return `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
}

/**
 * Checks if mobile greeting should be shown
 * @returns {boolean} True if greeting should be shown, false otherwise
 */
function shouldShowMobileGreeting() {
    const hasSeenGreeting = sessionStorage.getItem('hasSeenGreeting');
    const viewportWidth = window.innerWidth;
    return viewportWidth < 1050 && hasSeenGreeting !== 'true';
}

/**
 * Marks greeting as seen in session storage
 */
function markGreetingAsSeen() {
    sessionStorage.setItem('hasSeenGreeting', 'true');
}

/**
 * Gets current user's name from local storage
 * @returns {string} User's name or default guest name
 */
function getCurrentUserName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.name || 'Gast';
}

/**
 * Creates fullscreen greeting element
 * @returns {HTMLElement} Fullscreen greeting element
 */
function createGreetingElement() {
    const now = new Date();
    const greeting = getGreeting(now.getHours());
    const userName = getCurrentUserName();
    
    const fullscreenGreeting = document.createElement('div');
    fullscreenGreeting.className = 'fullscreen-greeting';
    fullscreenGreeting.innerHTML = getMobileGreetingTemplate(greeting, userName);
    
    return fullscreenGreeting;
}

/**
 * Hides the summary container
 * @returns {HTMLElement} Hidden summary container
 */
function hideSummaryContainer() {
    const summaryContainer = document.querySelector('.summary_container');
    summaryContainer.classList.add('summary-content-hidden');
    return summaryContainer;
}

/**
 * Checks if mobile greeting should be shown and prepares greeting element
 * @returns {Object|null} Object with greeting elements or null if greeting shouldn't be shown
 */
function prepareMobileGreeting() {
    if (!shouldShowMobileGreeting()) {
        return null;
    }
    
    markGreetingAsSeen();
    
    const fullscreenGreeting = createGreetingElement();
    const summaryContainer = hideSummaryContainer();
    
    return { fullscreenGreeting, summaryContainer };
}

/**
 * Shows a mobile greeting that disappears after a few seconds
 */
function showMobileGreeting() {
    const elements = prepareMobileGreeting();
    if (!elements) return;
    
    const { fullscreenGreeting, summaryContainer } = elements;
    
    document.body.appendChild(fullscreenGreeting);
    
    // Start animation sequence after greeting is shown
    startGreetingAnimation(fullscreenGreeting, summaryContainer);
}

/**
 * Handles the animation sequence for the greeting
 * @param {HTMLElement} fullscreenGreeting - The greeting element to animate
 * @param {HTMLElement} summaryContainer - The summary content to show after animation
 */
function startGreetingAnimation(fullscreenGreeting, summaryContainer) {
    setTimeout(() => {
        fullscreenGreeting.classList.add('hidden');
        
        setTimeout(() => {
            summaryContainer.classList.remove('summary-content-hidden');
            summaryContainer.classList.add('summary-content-visible');
            
            setTimeout(() => {
                fullscreenGreeting.remove();
            }, 1000);
        }, 1000);
    }, 3000);
}

/**
 * Parses a date string into a Date object
 * @param {string} dateString - Date string in format "DD/MM/YYYY"
 * @returns {Date|null} Parsed Date object or null if input is invalid
 */
function parseDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}