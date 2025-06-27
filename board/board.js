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
 * Initializes the board view and loads all required data
 *
 * @returns {Promise<void>} Promise that resolves when initialization is complete
 */
async function init() {
    renderSidebar();
    renderContent();
    updateUserProfile();
    checkOrientation();
    await loadContactData();
    await loadAddTask();
    renderColumns();
    loadContactsToAssignedEditTask();
    await initDragAndDrop();
}

/**
 * Renders all task cards in their respective status columns on the board
 *
 * @returns {void} Updates the DOM with current task cards
 */
function renderContent() {
    headerContainer.innerHTML += getHeaderTemplate();
}

/**
 * Loads all tasks from the database
 *
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
 * Converts task data from object to array format with IDs included
 *
 * @param {Object} taskData - Task data from the database
 */
function convertTasksToArray(taskData) {
    allTasks = Object.entries(taskData).map(([id, task]) => ({
        ...task,
        id,
    }));
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
 * Filters tasks array by specified status
 *
 * @param {Array} tasks - Array of task objects to filter
 * @param {string} status - Status to filter by ('toDo', 'inProgress', 'awaitingFeedback', 'done')
 * @returns {Array} Filtered array containing only tasks matching the specified status
 */
function filterTasksByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}

/**
 * Removes all child elements from specified container element
 *
 * @param {HTMLElement} container - DOM element to be cleared
 * @returns {void} Clears the specified container's content
 */
function clearContainer(container) {
    container.innerHTML = '';
}

/**
 * Renders multiple task cards into specified container
 *
 * @param {Array} tasks - Array of task objects to be rendered
 * @param {HTMLElement} container - DOM element where tasks should be rendered
 * @returns {void} Renders task cards into the container
 */
function renderTasks(tasks, container) {
    tasks.forEach((task) => {
        container.innerHTML += getTaskCard(task);
        toggleSectionButton();
    });
}

/**
 * Begins the drag process when a user starts dragging a task
 *
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
 *
 * @param {Element} element - The element being dragged
 * @param {Event} event - The drag event
 */
function saveDraggedCardSize(element, event) {
    const dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight,
    };
    try {
        event.dataTransfer.setData('application/json', JSON.stringify(dimensions));
    } catch (e) {}
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
}

/**
 * Allows dropping by preventing the default behavior
 *
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
 *
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
 *
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
 * Removes all placeholder elements from task columns
 *
 * @returns {void} Removes all elements with class 'drag_area_placeholder'
 */
function removePlaceholders() {
    document.querySelectorAll('.drag_area_placeholder').forEach((placeholder) => {
        placeholder.remove();
    });
}

/**
 * Handles when a task is dropped into a column
 *
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
 * Removes all visual drag and drop effects from the board
 *
 * @returns {void} Removes highlighting and drag-related classes from elements
 */
function cleanupDragEffects() {
    document.querySelectorAll('.task_card.dragging').forEach((element) => {
        element.classList.remove('dragging');
    });
    removePlaceholders();
    sessionStorage.removeItem('draggedElementDimensions');
}

/**
 * Determines which status a task should get based on the drop zone
 *
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
 *
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
    dragAreas.forEach((area) => {
        area.ondragover = allowDrop;
        area.ondrop = handleDrop;
    });
    document.addEventListener('dragend', handleDragEnd);
}

/**
 * Moves a task to a different status and updates the database
 *
 * @param {string} taskId - ID of the task to move
 * @param {string} targetStatus - The new status for the task
 */
async function moveTo(taskId, targetStatus) {
    const taskIndex = allTasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;
    allTasks[taskIndex].status = targetStatus;
    await updateTaskStatus(taskId, targetStatus);
    renderColumns();
}

/**
 * Updates the task status in the database
 *
 * @param {string} taskId - ID of the task to update
 * @param {string} status - The new status value
 */
async function updateTaskStatus(taskId, status) {
    try {
        await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify({ status: status }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

/**
 * Checks the task object and returns its card HTML
 *
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
 * Renders the responsive sidebar menu for mobile view
 *
 * @returns {void} Updates the DOM with sidebar menu elements and event listeners
 */
function renderSidebar() {
    const mediaQuery = window.matchMedia('(min-width: 1050px)');
    const handleBreakpoint = () => {
        updateSidebar();
    };
    mediaQuery.addEventListener('change', handleBreakpoint);
    updateSidebar();
}

/**
 * Updates the sidebar display based on current screen size
 *
 * @param {HTMLElement} main - Main content container element
 * @param {HTMLElement} side - Sidebar container element
 * @param {HTMLElement} mobile - Mobile menu container element
 * @returns {void} Updates visibility and layout of sidebar elements
 *
 * This function checks the current viewport width and updates the sidebar
 * display accordingly. For desktop views (>= 1050px), it shows the regular
 * sidebar. For mobile views (< 1050px), it displays the mobile sidebar
 * with the current page highlighted and hides the desktop sidebar.
 */
function updateSidebar() {
    const main = document.getElementById('navbar_container');
    const side = document.getElementById('sidebar_container');
    const mobile = document.getElementById('navbar_mobile_container');
    const currentPage = window.location.pathname;
    const isMobile = window.innerWidth < 1050;
    main.innerHTML = isMobile ? '' : getSidebarTemplate();
    mobile.innerHTML = isMobile ? getSidebarTemplateMobile(currentPage) : '';
    side.style.display = isMobile ? 'none' : 'block';
}

