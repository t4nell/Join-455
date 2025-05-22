/**
 * @constant {HTMLElement} mainContainer - Container for the navigation bar
 */
const mainContainer = document.getElementById("navbar_container");

/**
 * @constant {HTMLElement} greetingContainer - Container for the greeting message
 */
const greetingContainer = document.getElementById("summary_greating_container");

/**
 * Determines the appropriate greeting based on the time of day
 * @param {number} hours - Current hour (0-23)
 * @returns {string} Appropriate greeting message
 */
function getGreeting(hours) {
    if (hours >= 0 && hours < 10) {
        return "Good morning";
    } else if (hours >= 10 && hours < 19) {
        return "Good day";
    } else {
        return "Good evening";
    }
}

/**
 * Updates the greeting with the current user's name
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
 * Checks user authentication status
 * @throws {Error} If no user is authenticated
 * @returns {Object} The current user object
 */
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        throw new Error('Unauthenticated'); // Abbruch, falls kein User
    }
    return currentUser; // Für weitere Verwendung
}

/**
 * Initializes the user interface components
 * @param {Object} currentUser - Current user object
 * @param {string} currentUser.name - User's name
 * @param {boolean} currentUser.isGuest - Whether user is a guest
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
 * Loads and processes task data
 * @async
 * @returns {Promise<Object>} The calculated task statistics
 */
async function loadAndUpdateTaskData() {
    const tasks = await fetchTasks();
    const stats = calculateTaskStats(tasks);
    updateSummaryUI(stats);
    return stats; // Optional für weitere Verarbeitung
}

window.onload = async function() {
    try {
        const currentUser = checkAuth();
        initializeUI(currentUser);
        await loadAndUpdateTaskData();
        makeContainersClickable(); // Neue Zeile
    } catch (error) {
        console.error("Initialization error:", error);
        showNotification(error.message || 'Fehler beim Laden der Daten');
    }
};

// Firebase zugriffe
const BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/";

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

async function fetchTaskData() {
    const response = await fetch(`${BASE_URL}addTask.json`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
}

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
        assignedTo: task.assignedTo || {}
    }));
}

function filterActiveTasks(tasks) {
    return tasks.filter(task => task.status !== 'deleted');
}

async function fetchTasks() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];

        const rawData = await fetchTaskData();
        if (!rawData) return [];

        const allTasks = transformTaskData(rawData);
        console.log("Geladene Tasks:", allTasks);

        return filterActiveTasks(allTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

function normalizeTaskStatus(status) {
    if (!status) return '';
    
    return status.toLowerCase().trim()
        .replace(/\s+/g, '') // Entfernt alle Leerzeichen
        .replace('awaiting', 'await') // Standardisiert Feedback-Status
        .replace('feedback', 'feedback');
}

const STATUS_MAPPINGS = {
    todo: ['todo'],
    done: ['done'],
    inProgress: ['inprogress', 'in progress'],
    awaitingFeedback: ['awaitfeedback', 'awaitingfeedback', 'await feedback']
};

function matchesStatus(normalizedStatus, targetStatus) {
    return STATUS_MAPPINGS[targetStatus]
        .some(pattern => normalizedStatus.includes(pattern));
}

function countStatusOccurrences(tasks) {
    const counts = Object.keys(STATUS_MAPPINGS)
        .reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
    
    tasks.forEach(task => {
        const normalizedStatus = normalizeTaskStatus(task.status);
        
        for (const statusType in STATUS_MAPPINGS) {
            if (matchesStatus(normalizedStatus, statusType)) {
                counts[statusType]++;
                break; // Keine Mehrfachzählung
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
        
        return (taskDate && (!closestDate || taskDate < closestDate)) 
            ? task 
            : closest;
    }, null);
}

function analyzeUrgentTasks(tasks) {
    const urgentTasks = tasks.filter(isUrgentTask);
    
    return {
        urgentCount: urgentTasks.length,
        nextUrgent: findNextUrgentTask(urgentTasks)
    };
}

function logTaskDebugInfo(tasks) {
    console.log("Alle Task-Status vor der Verarbeitung:");
    tasks.forEach(task => {
        console.log(`Task "${task.title}": ` + 
                   `Original Status = "${task.status}", ` +
                   `Normalisiert = "${normalizeTaskStatus(task.status)}"`);
    });
}

/**
 * Berechnet Statistiken für die übergebenen Tasks
 * @param {Array<Object>} tasks - Array von Task-Objekten
 * @param {string} tasks[].status - Status des Tasks
 * @param {string} tasks[].priority - Priorität des Tasks
 * @param {string} tasks[].dueDate - Fälligkeitsdatum des Tasks
 * @returns {Object} Berechnete Statistiken
 * @property {number} todo - Anzahl der Todo-Tasks
 * @property {number} done - Anzahl der erledigten Tasks
 * @property {number} inProgress - Anzahl der Tasks in Bearbeitung
 * @property {number} urgent - Anzahl der dringenden Tasks
 * @property {string|null} upcomingDeadline - Nächstes Fälligkeitsdatum
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
        totalTasks: tasks.length
    };

    console.log("Finale Statistiken:", stats);
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
    
    container.innerHTML = `
        <span class="summary_number">${value}</span>
        <span class="summary_text">${label}</span>
    `;
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
    // Einfache Statistik-Karten
    updateStatCard('summary_todo_container', stats.todo, 'To-do');
    updateStatCard('summary_done_container', stats.done, 'Done');
    updateStatCard('summary_tasks_board_container', stats.totalTasks, 'Tasks in Board');
    updateStatCard('summary_tasks_progress_container', stats.inProgress, 'Tasks In Progress');
    updateStatCard('summary_await_feedback_container', stats.awaitingFeedback, 'Awaiting Feedback');
    
    // Spezialkarten
    updateUrgentCard(stats.urgent);
    updateDeadlineCard(stats.nextUrgentTask);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
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
        'summary_await_feedback_container'
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
    getClickableContainerIds().forEach(containerId => {
        const container = document.getElementById(containerId) || 
                         document.querySelector(`.${containerId}`);
        makeContainerClickable(container);
    });
}

function init () {
    renderSidebar();
    renderHeader();
    updateUserProfile()
}