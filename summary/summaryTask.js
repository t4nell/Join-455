const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Fetches task data from Firebase database
 * @async
 * @returns {Promise<Object>} Raw task data from Firebase
 * @throws {Error} If network request fails
 */
async function fetchTaskData() {
    const response = await fetch(`${BASE_URL}addTask.json`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

/**
 * Loads task data from Firebase and updates the UI with calculated statistics
 * @async
 * @returns {Promise<Object>} calculated statistics object
 */
async function loadTaskData() {
    const tasksFromDatabase = await fetchTaskData();
    const statistics = !tasksFromDatabase 
        ? createEmptyStatsObject() 
        : calculateTaskStats(tasksFromDatabase);
    
    updateSummaryUI(statistics);
    
    if (statistics == null) {
        showNotification('Error loading tasks');
    }
    return statistics;
}

/**
 * Creates an empty statistics object with zero values
 * @returns {Object} Empty statistics object
 */
function createEmptyStatsObject() {
    return {
        todo: 0,
        done: 0,
        inProgress: 0,
        urgent: 0,
        totalTasks: 0,
        awaitingFeedback: 0,
    };
}

/**
 * Creates a statistics object with default values
 * @returns {Object} Statistics object with standard values
 */
function createStatsObject() {
    return {
        todo: 0,
        done: 0,
        inProgress: 0,
        awaitingFeedback: 0,
        urgent: 0,
        totalTasks: 0,
        upcomingDeadline: null,
        nextUrgentTask: null
    };
}

/**
 * Calculates task statistics from database data
 * @param {Object} tasksFromDatabase - Task data from Firebase
 * @returns {Object} Calculated statistics
 */
function calculateTaskStats(tasksFromDatabase) {
    const stats = createStatsObject();
    if (!tasksFromDatabase) return stats;
    
    stats.totalTasks = Object.keys(tasksFromDatabase).length;
    const urgentTasks = processAllTasks(tasksFromDatabase, stats);
    handleUrgentTasks(stats, urgentTasks);
    return stats;
}

/**
 * Handles urgent tasks processing for statistics
 * @param {Object} stats - Statistics object to update
 * @param {Array} urgentTasks - Array of urgent tasks
 */
function handleUrgentTasks(stats, urgentTasks) {
    if (urgentTasks.length > 0) {
        const closestUrgentTask = findTaskWithClosestDeadline(urgentTasks);
        stats.nextUrgentTask = closestUrgentTask;
        stats.upcomingDeadline = closestUrgentTask.dueDate;
    }
}

/**
 * Processes all tasks and updates the statistics
 * @param {Object} tasksFromDatabase - All tasks from database
 * @param {Object} stats - Statistics object to update
 * @returns {Array} Array of urgent tasks
 */
function processAllTasks(tasksFromDatabase, stats) {
    const urgentTasks = [];

    for (let taskID in tasksFromDatabase) {
        const task = tasksFromDatabase[taskID];
        processIndividualTask(task, stats, urgentTasks);
    }
    return urgentTasks;
}

/**
 * Processes a single task and updates statistics accordingly
 * @param {Object} task - The task to process
 * @param {Object} stats - Statistics object to update
 * @param {Array} urgentTasks - Array to collect urgent tasks
 */
function processIndividualTask(task, stats, urgentTasks) {
    countTaskStatus(stats, task);
    if (isUrgentWithDueDate(task)) {
        stats.urgent++;
        urgentTasks.push(task);
    }
}

/**
 * Updates status counts in the stats object
 * @param {Object} stats - Statistics object to update
 * @param {Object} task - The task to process
 */
function countTaskStatus(stats, task) {
    const status = task.status?.toLowerCase();
    if (status === 'todo') stats.todo++;
    else if (status === 'done') stats.done++;
    else if (status === 'inprogress') stats.inProgress++;
    else if (status === 'awaitingfeedback') stats.awaitingFeedback++;
}

/**
 * Checks if a task has urgent priority
 * @param {Object} task - Task to check
 * @returns {boolean} True if task is urgent
 */
function isUrgent(task) {
    return task.priority && task.priority.toLowerCase() === 'urgent';
}

/**
 * Checks if a task is urgent and has a due date
 * @param {Object} task - The task to check
 * @returns {boolean} True if task is urgent and has a due date
 */
function isUrgentWithDueDate(task) {
    return task.priority?.toLowerCase() === 'urgent' && task.dueDate;
}

/**
 * Find the urgent task with the closest deadline
 * @param {Array} tasks - List of task objects
 * @returns {Object} Information about urgent tasks
 */
function findUrgentTasks(tasks) {
    const urgentTasks = tasks.filter(isUrgent);
    
    if (urgentTasks.length === 0) {
        return createEmptyUrgentTasksResult();
    }
    
    const closestDeadline = findTaskWithClosestDeadline(urgentTasks);
    
    return {
        urgentCount: urgentTasks.length,
        nextUrgent: closestDeadline
    };
}

/**
 * Creates an empty result for when no urgent tasks exist
 * @returns {Object} Empty urgent tasks result
 */
function createEmptyUrgentTasksResult() {
    return {
        urgentCount: 0,
        nextUrgent: null
    };
}

/**
 * Finds the task with the earliest due date
 * @param {Array} tasks - List of tasks to search
 * @returns {Object} Task with the earliest due date
 */
function findTaskWithClosestDeadline(tasks) {
    let closestTask = null;
    
    for (let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i];
        closestTask = updateClosestTask(currentTask, closestTask);
    }
    
    return closestTask;
}

/**
 * Updates closest task if current task has earlier deadline
 * @param {Object} currentTask - Current task to check
 * @param {Object|null} closestTask - Current closest task
 * @returns {Object} Updated closest task
 */
function updateClosestTask(currentTask, closestTask) {
    if (hasValidDeadline(currentTask, closestTask)) {
        return currentTask;
    }
    return closestTask;
}

/**
 * Checks if a task has a valid deadline and if it's earlier than the current earliest date
 * @param {Object} task - The task to check
 * @param {Object|null} currentClosest - The current task with the earliest date
 * @returns {boolean} True if the task has a valid and earlier date
 */
function hasValidDeadline(task, currentClosest) {
    if (!hasValidDueDate(task)) {
        return false;
    }
    if (currentClosest == null) {
        return true;
    }
    return isEarlierDeadline(task, currentClosest);
}

/**
 * Checks if a task has a valid due date
 * @param {Object} task - The task to check
 * @returns {boolean} True if the date is valid
 */
function hasValidDueDate(task) {
    if (task.dueDate == null) {
        return false;
    }
    
    let taskDate = parseDate(task.dueDate);
    return taskDate != null;
}

/**
 * Compares if a task has an earlier deadline than the current earliest task
 * @param {Object} task - The task to check
 * @param {Object} currentClosest - The current task with the earliest date
 * @returns {boolean} True if the task has an earlier deadline
 */
function isEarlierDeadline(task, currentClosest) {
    let taskDate = parseDate(task.dueDate);
    let currentClosestDate = parseDate(currentClosest.dueDate);
    
    return taskDate < currentClosestDate;
}

/**
 * Parses a date string into a Date object
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed Date object or null if input is invalid
 */
function parseDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Transforms the raw task data into a standardized format
 * @param {Object} tasksFromDatabase - Raw task data from Firebase
 * @returns {Array<Object>} Array with formatted task objects
 */
function transformTaskData(tasksFromDatabase) {
    let formattedTasksList = [];
    
    if (tasksFromDatabase) {
        formattedTasksList = processTasksForTransformation(tasksFromDatabase);
    }
    
    return formattedTasksList;
}

/**
 * Processes all tasks for transformation
 * @param {Object} tasksFromDatabase - Raw task data from Firebase
 * @returns {Array<Object>} Array with formatted task objects
 */
function processTasksForTransformation(tasksFromDatabase) {
    let formattedTasksList = [];
    
    for (let taskID in tasksFromDatabase) {
        let formattedTask = createTransformedTask(taskID, tasksFromDatabase[taskID]);
        formattedTasksList.push(formattedTask);
    }
    
    return formattedTasksList;
}

/**
 * Creates a transformed task object from a single task
 * @param {string} id - The ID of the task
 * @param {Object} task - The original task object
 * @returns {Object} The transformed task object
 */
function createTransformedTask(id, task) {
    let newTask = createBaseTask(id, task);
    addTaskExtensions(newTask, task);
    return newTask;
}

/**
 * Creates base task object with core properties
 * @param {string} id - Task ID
 * @param {Object} task - Original task
 * @returns {Object} Base task object
 */
function createBaseTask(id, task) {
    return {
        id: id,
        category: task.category,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status
    };
}

/**
 * Adds extended properties to task object
 * @param {Object} newTask - Task object to extend
 * @param {Object} task - Original task data
 */
function addTaskExtensions(newTask, task) {
    newTask.subtasks = extractSubtasks(task);
    newTask.assignedTo = task.assignedTo || {};
}

/**
 * Extracts subtasks from a task
 * @param {Object} task - The task object
 * @returns {Array} List of subtasks
 */
function extractSubtasks(task) {
    let subtasksList = [];
    
    if (task.subtasks) {
        for (let subtaskId in task.subtasks) {
            subtasksList.push(task.subtasks[subtaskId]);
        }
    }
    return subtasksList;
}

/**
 * Deletes a task by its ID
 * @param {string} taskId - ID of the task to delete
 */
function deleteTaskById(taskId) {
    const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
    const updatedTasks = filterOutTask(allTasks, taskId);
    
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    loadTaskData();
}

/**
 * Filters out a specific task from the task list
 * @param {Array} allTasks - All tasks
 * @param {string} taskId - ID of task to remove
 * @returns {Array} Filtered task list
 */
function filterOutTask(allTasks, taskId) {
    const updatedTasks = [];
    
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id !== taskId) {
            updatedTasks.push(allTasks[i]);
        }
    }
    
    return updatedTasks;
}

window.loadTaskData = loadTaskData;
window.fetchTaskData = fetchTaskData;
window.transformTaskData = transformTaskData;
window.deleteTaskById = deleteTaskById;
window.createStatsObject = createStatsObject;
window.parseDate = parseDate;