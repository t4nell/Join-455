/**
 * @constant {HTMLElement} greetingContainer - Container for the greeting message
 */
const greetingContainer = document.getElementById('summary_greating_container');

/**
 * @constant {HTMLElement} mainContainer - Container for the navigation bar
 */
const mainContainer = document.getElementById('navbar_container');

/**
 * @constant {HTMLElement} headerContainer - Container for the header
 */
const headerContainer = document.getElementById('header_container');

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
 * Updates the greeting with current user's name
 * @returns {void}
 */
function updateGreeting() {
    const now = new Date();
    const greeting = getGreeting(now.getHours());
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.name || 'Gast';

    greetingContainer.innerHTML = `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
}

/**
 * Updates a statistic card with new values
 * @param {string} containerId - ID of the container element
 * @param {number} value - The numeric value to display
 * @param {string} label - The text label to display
 */
function updateStatCard(containerId, value, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const numberElement = container.querySelector('.summary_number');
    const textElement = container.querySelector('.summary_text');

    if (numberElement) numberElement.textContent = value;
    if (textElement) textElement.textContent = label;
}

/**
 * Updates the urgent tasks card with count and icon
 * @param {number} urgentCount - Number of urgent tasks
 */
function updateUrgentCard(urgentCount) {
    const container = document.getElementById('summary_importance_container');
    if (!container) return;

    container.innerHTML = `
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
 * Updates the deadline card with the next urgent task deadline
 * @param {Object|null} nextUrgentTask - The next urgent task object or null
 */
function updateDeadlineCard(nextUrgentTask) {
    const container = document.getElementById('summary_deadline_container');
    if (!container) return;

    const deadlineText = nextUrgentTask?.dueDate
        ? formatDate(parseDate(nextUrgentTask.dueDate))
        : 'No urgent deadlines';

    container.innerHTML = `
        <span class="summary_date">${deadlineText}</span>
        <span class="summary_text">Upcoming Deadline</span>
    `;
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
 * Shows a temporary notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
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
        'summary_await_feedback_container',
    ];
}

/**
 * Makes a container element clickable and adds styling
 * @param {HTMLElement} containerElement - The container element to make clickable
 */
function makeContainerClickable(containerElement) {
    if (!containerElement) return;

    containerElement.classList.add('clickable-container');
    containerElement.addEventListener('click', navigateToBoard);
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
    getClickableContainerIds().forEach((containerId) => {
        const container = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
        makeContainerClickable(container);
    });
}

/**
 * Renders the sidebar using template
 */
function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}

/**
 * Renders the header using template
 */
function renderHeader() {
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * Shows a fullscreen greeting that fades out after a few seconds on mobile devices
 * Only shown on first visit per session
 */
function showMobileGreeting() {
  const hasSeenGreeting = sessionStorage.getItem('hasSeenGreeting');
  
  const viewportWidth = window.innerWidth;
  if (viewportWidth >= 1050 || hasSeenGreeting === 'true') {
    return;
  }
  
  sessionStorage.setItem('hasSeenGreeting', 'true');
  
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userName = currentUser?.name || 'Gast';
  
  const fullscreenGreeting = document.createElement('div');
  fullscreenGreeting.className = 'fullscreen-greeting';
  fullscreenGreeting.innerHTML = `
    <h1>${greeting},</h1>
    <h2>${userName}</h2>
  `;
  
  const summaryContainer = document.querySelector('.summary_container');
  summaryContainer.classList.add('summary-content-hidden');
  
  document.body.appendChild(fullscreenGreeting);
  
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