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
        const rawData = await fetchTaskData(); // Changed from fetchTasks to fetchTaskData
        const tasks = transformTaskData(rawData); // Transform the raw data
        const activeTasks = filterActiveTasks(tasks); // Filter out deleted tasks

        console.log('Fetched tasks:', activeTasks); // Debug log

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

// constants for Firebase database URL
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
        .replace(/\s+/g, '') // delete all whitespace
        .replace('awaiting', 'await') // feedback
        .replace('feedback', 'feedback');
}

const STATUS_MAPPINGS = {
    todo: ['todo'],
    done: ['done'],
    inProgress: ['inprogress', 'in progress'],
    awaitingFeedback: ['awaitfeedback', 'awaitingfeedback', 'await feedback'],
};

function matchesStatus(normalizedStatus, targetStatus) {
    return STATUS_MAPPINGS[targetStatus].some((pattern) => normalizedStatus.includes(pattern));
}

function countStatusOccurrences(tasks) {
    const counts = Object.keys(STATUS_MAPPINGS).reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    tasks.forEach((task) => {
        const normalizedStatus = normalizeTaskStatus(task.status);

        for (const statusType in STATUS_MAPPINGS) {
            if (matchesStatus(normalizedStatus, statusType)) {
                counts[statusType]++;
                break; // prevent double counting
            }
        }
    });

    return counts;
}

function isUrgentTask(task) {
    return task.priority && normalizeTaskStatus(task.priority) === 'urgent';
}

function safeParseDate(dateString) {
    try {
        return dateString ? parseDate(dateString) : null;
    } catch {
        return null;
    }
}

function findNextUrgentTask(urgentTasks) {
    return urgentTasks.reduce((closest, task) => {
        const taskDate = safeParseDate(task.dueDate);
        const closestDate = closest ? safeParseDate(closest.dueDate) : null;

        return taskDate && (!closestDate || taskDate < closestDate) ? task : closest;
    }, null);
}

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

function parseDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

function updateStatCard(containerId, value, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Finde die entsprechenden Elemente statt den ganzen Container zu überschreiben
    const numberElement = container.querySelector('.summary_number');
    const textElement = container.querySelector('.summary_text');

    if (numberElement) numberElement.textContent = value;
    if (textElement) textElement.textContent = label;
}

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

function updateSummaryUI(stats) {
    updateStatCard('summary_todo_container', stats.todo, 'To-do');
    updateStatCard('summary_done_container', stats.done, 'Done');
    updateStatCard('summary_tasks_board_container', stats.totalTasks, 'Tasks in Board');
    updateStatCard('summary_tasks_progress_container', stats.inProgress, 'Tasks In Progress');
    updateStatCard('summary_await_feedback_container', stats.awaitingFeedback, 'Awaiting Feedback');

    updateUrgentCard(stats.urgent);
    updateDeadlineCard(stats.nextUrgentTask);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

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

function makeContainerClickable(containerElement) {
    if (!containerElement) return;

    containerElement.classList.add('clickable-container');
    containerElement.addEventListener('click', navigateToBoard);
}

function navigateToBoard() {
    window.location.href = '../board/board.html';
}

function makeContainersClickable() {
    getClickableContainerIds().forEach((containerId) => {
        const container = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
        makeContainerClickable(container);
    });
}

function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}

function renderHeader() {
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * Shows a fullscreen greeting that fades out after a few seconds on mobile devices
 */
function showMobileGreeting() {
  const viewportWidth = window.innerWidth;
  
  // Only show the special greeting on screens smaller than 1050px
  if (viewportWidth >= 1050) {
    return;
  }
  
  // Get greeting content
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userName = currentUser?.name || 'Gast';
  
  // Create fullscreen greeting element
  const fullscreenGreeting = document.createElement('div');
  fullscreenGreeting.className = 'fullscreen-greeting';
  fullscreenGreeting.innerHTML = `
    <h1>${greeting},</h1>
    <h2>${userName}</h2>
  `;
  
  // Hide the main summary content initially
  const summaryContainer = document.querySelector('.summary_container');
  summaryContainer.classList.add('summary-content-hidden');
  
  // Add the greeting to the body
  document.body.appendChild(fullscreenGreeting);
  
  // After 3 seconds, fade out the greeting and show the summary
  setTimeout(() => {
    fullscreenGreeting.classList.add('hidden');
    
    // After greeting fade completes, show summary content
    setTimeout(() => {
      summaryContainer.classList.remove('summary-content-hidden');
      summaryContainer.classList.add('summary-content-visible');
      
      // Remove the greeting element after it's fully faded out
      setTimeout(() => {
        fullscreenGreeting.remove();
      }, 1000);
    }, 1000);
  }, 3000);
}

// Modify the init function to call showMobileGreeting
async function init() {
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
    
    // Add this line to show mobile greeting
    showMobileGreeting();
  } catch (error) {
    console.error('Initialization error:', error);
    showNotification(error.message || 'Fehler beim Laden der Daten');
  }
}

// Add event listener to window resize to handle greeting when orientation changes
window.addEventListener('resize', () => {
  // If the greeting is already showing or has been shown, don't show it again
  if (!document.querySelector('.fullscreen-greeting')) {
    if (window.innerWidth < 1050) {
      // Don't show greeting on resize, only on initial load
      // This prevents triggering the greeting when resizing or rotating device
    }
  }
});

