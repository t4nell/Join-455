/**
 * @constant {HTMLElement} mainContainer - Container for the navigation bar
 */
const mainContainer = document.getElementById('navbar_container');

/**
 * @constant {HTMLElement} greetingContainer - Container for the greeting message
 */
const greetingContainer = document.getElementById('summary_greating_container');

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
 * checks if a user is authenticated
 * @throws {Error} if no user is found in localStorage
 * @returns {Object} User object from localStorage
 */
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        throw new Error('Unauthenticated'); // abourt further execution
    }
    return currentUser;
}

/**
 * initializes the UI components
 * @param {Object} currentUser - information about the current user
 * @param {string} currentUser.name - name of the user
 * @param {boolean} currentUser.isGuest - check if current user is a guest
 * @returns {void}
 */
function initializeUI(currentUser) {
    renderSidebar();
    renderHeader();
    updateUserProfile();
    updateGreeting();

    if (currentUser.isGuest) {
        showNotification('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
    }
}

/**
 * loads task data from Firebase and updates the UI with calculated statistics
 * @async
 * @returns {Promise<Object>} calculated statistics object
 */
async function loadAndUpdateTaskData() {
    try {
        const rawData = await fetchTaskData();
        const tasks = transformTaskData(rawData);
        const activeTasks = filterActiveTasks(tasks);

        console.log('Fetched tasks:', activeTasks);

        if (!Array.isArray(activeTasks) || activeTasks.length === 0) {
            console.warn('No tasks found or invalid data structure');
            return {
                todo: 0,
                done: 0,
                inProgress: 0,
                urgent: 0,
                totalTasks: 0,
                awaitingFeedback: 0,
            };
        }

        const stats = calculateTaskStats(activeTasks);
        console.log('Calculated stats:', stats);
        updateSummaryUI(stats);
        return stats;
    } catch (error) {
        console.error('Error in loadAndUpdateTaskData:', error);
        showNotification('Fehler beim Laden der Aufgaben');
        throw error;
    }
}

const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Gets the current user from localStorage
 * @returns {Object|null} The current user object or null if not found
 */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

/**
 * Fetches task data from Firebase database
 * @async
 * @returns {Promise<Object>} Raw task data from Firebase
 * @throws {Error} If network request fails
 */
async function fetchTaskData() {
    console.log('Fetching from:', `${BASE_URL}addTask.json`);
    const response = await fetch(`${BASE_URL}addTask.json`);
    if (!response.ok) {
        console.error('Fetch failed:', response.status, response.statusText);
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
}

/**
 * Transforms raw task data into a standardized format
 * @param {Object} rawData - Raw task data from Firebase
 * @returns {Array<Object>} Array of formatted task objects
 */
function transformTaskData(rawData) {
    return Object.entries(rawData || {}).map(([id, task]) => ({
        id,
        category: task.category,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        subtasks: Object.values(task.subtasks || {}),
        assignedTo: task.assignedTo || {},
    }));
}

/**
 * Filters out deleted tasks from the task list
 * @param {Array<Object>} tasks - Array of task objects
 * @returns {Array<Object>} Array of active tasks
 */
function filterActiveTasks(tasks) {
    return tasks.filter((task) => task.status !== 'deleted');
}

/**
 * Normalizes task status strings for consistent comparison
 * @param {string} status - The status string to normalize
 * @returns {string} Normalized status string
 */
function normalizeTaskStatus(status) {
    if (!status) return '';

    return status
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '')
        .replace('awaiting', 'await')
        .replace('feedback', 'feedback');
}

/**
 * Checks if a normalized status string matches a target status category
 * @param {string} normalizedStatus - The normalized status string
 * @param {string} targetStatus - The target status category to check against
 * @returns {boolean} True if the status matches the target category
 */
function matchesStatus(normalizedStatus, targetStatus) {
    return STATUS_MAPPINGS[targetStatus].some((pattern) => normalizedStatus.includes(pattern));
}

/**
 * Counts occurrences of each status type in the tasks array
 * @param {Array<Object>} tasks - Array of task objects
 * @returns {Object} Object containing counts for each status type
 */
function countStatusOccurrences(tasks) {
    const counts = Object.keys(STATUS_MAPPINGS).reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    tasks.forEach((task) => {
        const normalizedStatus = normalizeTaskStatus(task.status);

        for (const statusType in STATUS_MAPPINGS) {
            if (matchesStatus(normalizedStatus, statusType)) {
                counts[statusType]++;
                break;
            }
        }
    });

    return counts;
}

/**
 * Checks if a task has urgent priority
 * @param {Object} task - Task object to check
 * @returns {boolean} True if the task has urgent priority
 */
function isUrgentTask(task) {
    return task.priority && normalizeTaskStatus(task.priority) === 'urgent';
}

/**
 * Safely parses a date string into a Date object
 * @param {string} dateString - Date string in format "DD/MM/YYYY"
 * @returns {Date|null} Parsed Date object or null if parsing fails
 */
function safeParseDate(dateString) {
    try {
        return dateString ? parseDate(dateString) : null;
    } catch {
        return null;
    }
}

/**
 * Finds the next urgent task based on due date
 * @param {Array<Object>} urgentTasks - Array of urgent task objects
 * @returns {Object|null} The next urgent task or null if none found
 */
function findNextUrgentTask(urgentTasks) {
    return urgentTasks.reduce((closest, task) => {
        const taskDate = safeParseDate(task.dueDate);
        const closestDate = closest ? safeParseDate(closest.dueDate) : null;

        return taskDate && (!closestDate || taskDate < closestDate) ? task : closest;
    }, null);
}

/**
 * Analyzes urgent tasks and finds the next upcoming deadline
 * @param {Array<Object>} tasks - Array of task objects
 * @returns {Object} Object containing urgent task count and the next urgent task
 */
function analyzeUrgentTasks(tasks) {
    const urgentTasks = tasks.filter(isUrgentTask);

    return {
        urgentCount: urgentTasks.length,
        nextUrgent: findNextUrgentTask(urgentTasks),
    };
}

function logTaskDebugInfo(tasks) {
    console.log('Alle Task-Status vor der Verarbeitung:');
    tasks.forEach((task) => {
        console.log(
            `Task "${task.title}": ` +
                `Original Status = "${task.status}", ` +
                `Normalisiert = "${normalizeTaskStatus(task.status)}"`
        );
    });
}

/**
 * calculates statistics from an array of task objects
 * @param {Array<Object>} tasks - Array of task objects
 * @param {string} tasks[].status - Status of the Task
 * @param {string} tasks[].priority - Prioryty of the Task
 * @param {string} tasks[].dueDate - Due date of the Task
 * @returns {Object} calculated statistics
 * @property {number} todo - caount of tasks to do
 * @property {number} done - count of tasks done
 * @property {number} inProgress - count of tasks in progress
 * @property {number} urgent - count of urgent tasks
 * @property {string|null} upcomingDeadline - deadline of the next urgent task
 */
function calculateTaskStats(tasks) {
    logTaskDebugInfo(tasks);

    const statusCounts = countStatusOccurrences(tasks);
    const { urgentCount, nextUrgent } = analyzeUrgentTasks(tasks);

    const stats = {
        ...statusCounts,
        urgent: urgentCount,
        upcomingDeadline: nextUrgent?.dueDate || null,
        nextUrgentTask: nextUrgent,
        totalTasks: tasks.length,
    };

    console.log('Finale Statistiken:', stats);
    return stats;
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
 * Initializes the page by checking authentication, setting up UI,
 * loading task data, and enabling interactive elements
 * @async
 */
async function init() {
    if (typeof checkOrientation === 'function') {
        checkOrientation();
    }
    
    try {
        console.log('Starting initialization...');
        const currentUser = checkAuth();
        console.log('User authenticated:', currentUser);

        initializeUI(currentUser);
        console.log('UI initialized');

        const taskData = await loadAndUpdateTaskData();
        console.log('Task data loaded:', taskData);

        makeContainersClickable();
        console.log('Initialization complete');
        
        showMobileGreeting();
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification(error.message || 'Fehler beim Laden der Daten');
    }
}

window.addEventListener('resize', () => {
    if (!document.querySelector('.fullscreen-greeting')) {
        if (window.innerWidth < 1050) {
            // Mobile-spezifischer Code hier
        }
    }
});