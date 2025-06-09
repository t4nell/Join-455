BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
const mainContainer = document.getElementById('navbar_container');
const headerContainer = document.getElementById('header_container');
const overlay = document.getElementById('overlay_background_container');
const taskDetailCard = document.getElementById('task_detail_card');
const dragAreaTodo = document.getElementById('drag_area_todo');
const dragAreaInProgress = document.getElementById('drag_area_in_progress');
const dragAreaAwaitFeedback = document.getElementById('drag_area_await_feedback');
const dragAreaDone = document.getElementById('drag_area_done');
let allTasks = [];

/**
 * Initializes the application by loading all necessary data and setting up components
 * This runs when the page first loads
 */
async function init() {
    renderSidebar();
    renderContent();
    updateUserProfile();
    await loadContactData();
    await loadAddTask();
    renderColumns();
    loadContactsToAssigned();
    await initDragAndDrop();
}

/**
 * Adds the header template to the page header container
 */
function renderContent() {
    headerContainer.innerHTML += getHeaderTemplate();
}

/**
 * Loads all tasks from the database
 * @param {string} path - Optional path parameter to specify database location
 */
async function loadAddTask(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let data = await response.json();
        
        if (!data || !data.addTask) {
            handleMissingTaskData(data);
            return;
        }
        
        const taskData = data.addTask;
        convertTasksToArray(taskData);
    } catch (error) {
        handleTaskLoadError(error);
    }
}

/**
 * Handles the case when no tasks are found in the database
 * @param {Object} data - The data received from the server
 */
function handleMissingTaskData(data) {
    console.error('No tasks found or invalid format:', data);
    allTasks = [];
}

/**
 * Handles errors that occur while loading tasks
 * @param {Error} error - The error that was thrown
 */
function handleTaskLoadError(error) {
    console.error('Error loading tasks:', error);
    allTasks = [];
}

/**
 * Converts task data from object to array format with IDs included
 * @param {Object} taskData - Task data from the database
 */
function convertTasksToArray(taskData) {
    allTasks = Object.entries(taskData).map(([id, task]) => ({
        ...task,
        id
    }));
    
    console.log('Tasks loaded:', allTasks);
}

/**
 * Renders all four task columns with their appropriate tasks
 */
function renderColumns() {
    renderAllTaskCards(allTasks, 'todo', dragAreaTodo);
    renderAllTaskCards(allTasks, 'inProgress', dragAreaInProgress);
    renderAllTaskCards(allTasks, 'awaitFeedback', dragAreaAwaitFeedback);
    renderAllTaskCards(allTasks, 'done', dragAreaDone);
}

/**
 * Renders all task cards for a specific status into the given container.
 * If no tasks match the status, it shows a placeholder message.
 *
 * @param {Array} allTasks - All available task objects.
 * @param {string} status - The task status to filter by (e.g. "todo").
 * @param {HTMLElement} container - The HTML element where the cards should appear.
 */
function renderAllTaskCards(allTasks, status, container) {
    const filteredTasks = filterTasksByStatus(allTasks, status);
    clearContainer(container);

    if (filteredTasks.length === 0) {
        container.innerHTML = renderPlaceholder();
        return;
    }

    renderTasks(filteredTasks, container);
}

/**
 * Returns only the tasks that match the given status.
 */
function filterTasksByStatus(tasks, status) {
    return tasks.filter(task => task.status === status);
}

/**
 * Clears the inner content of the given container.
 */
function clearContainer(container) {
    container.innerHTML = '';
}

/**
 * Adds each task card to the container.
 */
function renderTasks(tasks, container) {
    tasks.forEach(task => {
        container.innerHTML += getTaskCard(task);
    });
}


/**
 * Creates an empty placeholder for columns with no tasks
 * @returns {string} HTML for the empty placeholder
 */
function renderPlaceholder() {
    return `<div class="empty-column-placeholder">No tasks</div>`;
}

/**
 * Begins the drag process when a user starts dragging a task
 * @param {Event} event - The drag start event
 * @param {string} taskId - ID of the task being dragged
 */
function startDragging(event, taskId) {
    const draggedElement = event.target.closest('.task_card');
    event.dataTransfer.setData('text/plain', taskId);
    
    draggedElement.classList.add('dragging');
    
    saveDraggedCardSize(draggedElement, event);
}

/**
 * Saves the size of the card being dragged for later use
 * @param {Element} element - The element being dragged
 * @param {Event} event - The drag event
 */
function saveDraggedCardSize(element, event) {
    const dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };
    
    try {
        event.dataTransfer.setData('application/json', JSON.stringify(dimensions));
    } catch (e) {
        console.log('Browser does not support complex data in dataTransfer');
    }
    
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
}

/**
 * Allows dropping by preventing the default behavior
 * @param {Event} event - The dragover event
 */
function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    
    const dimensions = getDraggedDimensions(event);
    removePlaceholders();
    
    if (dimensions.width && dimensions.height) {
        const placeholder = createPlaceholder(dimensions);
        dropzone.appendChild(placeholder);
    }
}

/**
 * Gets the dimensions of the dragged element
 * @param {Event} event - The drag event
 * @returns {Object} An object with width and height
 */
function getDraggedDimensions(event) {
    let dimensionsStr = event.dataTransfer.getData('dimensions');
    
    if (!dimensionsStr) {
        dimensionsStr = sessionStorage.getItem('draggedElementDimensions');
    }
    
    return dimensionsStr ? JSON.parse(dimensionsStr) : {};
}

/**
 * Creates a placeholder element to show where the task will be placed
 * @param {Object} dimensions - Width and height for the placeholder
 * @returns {Element} The created placeholder element
 */
function createPlaceholder(dimensions) {
    const placeholder = document.createElement('div');
    placeholder.className = 'drag_area_placeholder';
    placeholder.style.width = `${dimensions.width}px`;
    placeholder.style.height = `${dimensions.height}px`;
    return placeholder;
}

/**
 * Removes all placeholder elements from the page
 */
function removePlaceholders() {
    document.querySelectorAll('.drag_area_placeholder').forEach(placeholder => {
        placeholder.remove();
    });
}

/**
 * Handles when a task is dropped into a column
 * @param {Event} event - The drop event
 */
function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const dropzone = event.currentTarget;
    
    cleanupDragEffects();
    
    const targetStatus = getTargetStatus(dropzone);
    
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    }
}

/**
 * Cleans up visual effects and stored data after drag operations
 */
function cleanupDragEffects() {
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    
    removePlaceholders();
    
    sessionStorage.removeItem('draggedElementDimensions');
}

/**
 * Determines which status a task should get based on the drop zone
 * @param {Element} dropzone - The element where the task was dropped
 * @returns {string} The target status (todo, inProgress, etc.)
 */
function getTargetStatus(dropzone) {
    if (dropzone.id === 'drag_area_todo') return 'todo';
    if (dropzone.id === 'drag_area_in_progress') return 'inProgress';
    if (dropzone.id === 'drag_area_await_feedback') return 'awaitFeedback';
    if (dropzone.id === 'drag_area_done') return 'done';
    return null;
}

/**
 * Handles the end of a drag operation (when the user releases)
 * @param {Event} event - The dragend event
 */
function handleDragEnd(event) {
    cleanupDragEffects();
}

/**
 * Sets up all drag areas with the necessary event handlers
 */
function setupDragAreas() {
    const dragAreas = [dragAreaTodo, dragAreaInProgress, dragAreaAwaitFeedback, dragAreaDone];
    
    dragAreas.forEach(area => {
        area.ondragover = allowDrop;
        area.ondrop = handleDrop;
    });
    
    document.addEventListener('dragend', handleDragEnd);
}

/**
 * Moves a task to a different status and updates the database
 * @param {string} taskId - ID of the task to move
 * @param {string} targetStatus - The new status for the task
 */
async function moveTo(taskId, targetStatus) {
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    allTasks[taskIndex].status = targetStatus;
    
    await updateTaskStatus(taskId, targetStatus);
    
    renderColumns();
}

/**
 * Updates the task status in the database
 * @param {string} taskId - ID of the task to update
 * @param {string} status - The new status value
 */
async function updateTaskStatus(taskId, status) {
    try {
        await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify({ status: status }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

/**
 * Checks the task object and returns its card HTML
 * @param {Object} task - The task object with all properties
 * @returns {string} HTML string for the task card or empty string if invalid
 */
function getTaskCard(task) {
    if (!task) {
        console.error('Cannot create task card: task is undefined');
        return '';
    }

    return generateTaskCardHTML(task);
}

/**
 * Shows the correct sidebar depending on screen size.
 * Desktop: shows full sidebar.
 * Mobile: shows mobile sidebar.
 */
function renderSidebar() {
    const main = document.getElementById('navbar_container');
    const side = document.getElementById('sidebar_container');
    const mobile = document.getElementById('navbar_mobile_container');

    function updateSidebar() {
        const isMobile = window.innerWidth < 1050;
        main.innerHTML = isMobile ? '' : getSidebarTemplate();
        mobile.innerHTML = isMobile ? getSidebarTemplateMobile() : '';
        side.style.display = isMobile ? 'none' : 'block';
    }

    window.addEventListener('resize', updateSidebar);
    updateSidebar(); // Show correct sidebar at first load
}