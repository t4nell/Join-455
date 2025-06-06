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
 * Starts the app and loads all necessary data
 * This function runs when the page is loaded
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
 * Adds the header to the page
 */
function renderContent() {
    headerContainer.innerHTML += getHeaderTemplate();
}

/**
 * Loads all tasks from the database
 * @param {string} path - Optional path for the database query
 */
async function loadAddTask(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let data = await response.json();
        
        if (!data || !data.addTask) {
            handleNoTasksFound(data);
            return;
        }
        
        convertTasksToArray(data.addTask);
    } catch (error) {
        handleTaskError(error);
    }
}

/**
 * Handles the case when no tasks are found
 * @param {Object} data - The data received from the server
 */
function handleNoTasksFound(data) {
    console.error('No tasks found or invalid format:', data);
    allTasks = [];
}

/**
 * Handles errors when loading tasks
 * @param {Error} error - The error that occurred
 */
function handleTaskError(error) {
    console.error('Error loading tasks:', error);
    allTasks = [];
}

/**
 * Converts task data from object format to array format
 * @param {Object} taskData - Task data from the database
 */
function convertTasksToArray(taskData) {
    allTasks = Object.entries(taskData).map(([id, task]) => {
        return {
            ...task,
            id
        };
    });
    
    console.log('Tasks loaded:', allTasks);
}

/**
 * Displays all task columns with their tasks
 */
function renderColumns() {
    renderAllTaskCards(allTasks, 'todo', dragAreaTodo);
    renderAllTaskCards(allTasks, 'inProgress', dragAreaInProgress);
    renderAllTaskCards(allTasks, 'awaitFeedback', dragAreaAwaitFeedback);
    renderAllTaskCards(allTasks, 'done', dragAreaDone);
}

/**
 * Shows all tasks for a specific column
 * @param {Array} allTasks - Array of all tasks
 * @param {string} state - The column status (todo, inProgress, etc.)
 * @param {Element} container - The HTML container for the column
 */
function renderAllTaskCards(allTasks, state, container) {
    const tasksForColumn = allTasks.filter((task) => task.status === state);
    container.innerHTML = '';
    
    if (tasksForColumn.length === 0) {
        container.innerHTML = renderPlaceholder();
        return;
    }
    
    tasksForColumn.forEach((task) => {
        container.innerHTML += getTaskCard(task);
    });
}

/**
 * Creates an empty placeholder for columns with no tasks
 * @returns {string} HTML string for the placeholder
 */
function renderPlaceholder() {
    return `<div class="empty-column-placeholder">No tasks yet</div>`;
}

/**
 * Starts the drag process for a task
 * @param {Event} event - The drag event
 * @param {string} taskId - ID of the task being dragged
 */
function startDragging(event, taskId) {
    const draggedElement = event.target.closest('.task_card');
    event.dataTransfer.setData('text/plain', taskId);
    draggedElement.classList.add('dragging');
    
    const dimensions = getElementDimensions(draggedElement);
    saveElementDimensions(dimensions, event);
}

/**
 * Gets the width and height of an element
 * @param {Element} element - The element to measure
 * @returns {Object} Object containing width and height
 */
function getElementDimensions(element) {
    return {
        width: element.offsetWidth,
        height: element.offsetHeight
    };
}

/**
 * Saves the dimensions for later use
 * @param {Object} dimensions - Width and height values
 * @param {Event} event - The drag event
 */
function saveElementDimensions(dimensions, event) {
    try {
        event.dataTransfer.setData('application/json', JSON.stringify(dimensions));
    } catch (e) {
        console.log('Browser does not support complex data in dataTransfer');
    }
    
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
}

/**
 * Allows an element to be dropped in a drop zone
 * @param {Event} event - The dragover event
 */
function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    
    const dimensions = getDimensionsFromStorage(event);
    removePlaceholders();
    
    if (dimensions.width && dimensions.height) {
        const placeholder = createPlaceholder(dimensions);
        dropzone.appendChild(placeholder);
    }
}

/**
 * Gets stored dimensions from dataTransfer or sessionStorage
 * @param {Event} event - The drag event
 * @returns {Object} The dimensions object
 */
function getDimensionsFromStorage(event) {
    let dimensionsStr = event.dataTransfer.getData('dimensions');
    if (!dimensionsStr) {
        dimensionsStr = sessionStorage.getItem('draggedElementDimensions');
    }
    
    return dimensionsStr ? JSON.parse(dimensionsStr) : {};
}

/**
 * Creates a visual placeholder element
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
    
    cleanupAfterDrag();
    
    const targetStatus = getTargetStatus(dropzone);
    
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    }
}

/**
 * Cleans up visual effects after dragging
 */
function cleanupAfterDrag() {
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    
    removePlaceholders();
    sessionStorage.removeItem('draggedElementDimensions');
}

/**
 * Gets the status based on which column was used
 * @param {Element} dropzone - The column element
 * @returns {string} The status (todo, inProgress, etc.)
 */
function getTargetStatus(dropzone) {
    if (dropzone.id === 'drag_area_todo') return 'todo';
    if (dropzone.id === 'drag_area_in_progress') return 'inProgress';
    if (dropzone.id === 'drag_area_await_feedback') return 'awaitFeedback';
    if (dropzone.id === 'drag_area_done') return 'done';
    return null;
}

/**
 * Handles the end of a drag operation
 * @param {Event} event - The dragend event
 */
function handleDragEnd(event) {
    cleanupAfterDrag();
}

/**
 * Sets up all drop areas for drag and drop
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
 * Moves a task to a different column
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
 * Creates HTML for a task card
 * @param {Object} task - The task object
 * @returns {string} HTML string for the task card
 */
function getTaskCard(task) {
    if (!task) {
        console.error('Cannot create task card: task is undefined');
        return '';
    }
    
    return `
        <div class="task_card" draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${task.id}">
            <div class="task_card_content">
                <h3 class="task_card_title">${task.title || 'No Title'}</h3>
                <p class="task_card_description">${task.description || 'No Description'}</p>
                <div class="task_card_footer">
                    <span class="task_card_due_date">${task.dueDate || ''}</span>
                    <span class="task_card_priority">${task.priority || ''}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Creates the mobile sidebar HTML
 * @returns {string} HTML string for the mobile sidebar
 */
function getSidebarTemplateMobile() {
    const currentPage = window.location.pathname;
    
    return ` 
    <div class="sidebar_container">  
        <nav class="sidebar_nav">
            <a href="../summary/summary.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon">
                <span>Summary</span>
            </a>
            <a href="../board/board.html" class="nav_item ${currentPage.includes('board') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon">
                <span>Board</span>
            </a>
            <a href="../addTask/addTask.html" class="nav_item ${currentPage.includes('addTask') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon">
                <span>Add Task</span>
            </a>
            <a href="../contacts/contacts.html" class="nav_item ${currentPage.includes('contacts') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/contacts.svg" alt="Contacts Icon">
                <span>Contacts</span>
            </a>
        </nav>
    </div>
    `;
}

/**
 * Renders the correct sidebar based on screen size
 */
function renderSidebar() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const mobileContainer = document.getElementById('navbar_mobile_container');
    
    function renderSidebarDesktop() {
        mobileContainer.innerHTML = '';
        mainContainer.innerHTML = getSidebarTemplate();
        navContainer.style.display = 'block';
    }
    
    function renderSidebarMobile() {
        mainContainer.innerHTML = '';
        mobileContainer.innerHTML = getSidebarTemplateMobile();
        navContainer.style.display = 'none';
    }
    
    function checkScreenSize() {
        const width = window.innerWidth;
        if (width < 1050) {
            renderSidebarMobile();
        } else {
            renderSidebarDesktop();
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}