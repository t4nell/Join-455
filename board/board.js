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
 * Initializes the board page by setting up all required components
 * @async
 * @returns {Promise<void>}
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
};


/**
 * Renders the header content for the board page
 * @returns {void}
 */
function renderContent() {
    headerContainer.innerHTML += getHeaderTemplate();
};


/**
 * Loads all tasks from the Firebase database
 * @async
 * @param {string} path - Optional path parameter for the API request
 * @returns {Promise<void>}
 */
async function loadAddTask(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseToJson = await response.json();
        if (!responseToJson || !responseToJson.addTask) {
            allTasks = [];
            return;
        }
        const addTaskData = responseToJson.addTask;
        allTasks = Object.entries(addTaskData).map(([id, task]) => ({
            ...task,
            id
        }));
    } catch (error) {
        console.error('Error loading tasks:', error);
        allTasks = [];
    };
};


/**
 * Renders all task columns with their respective task cards
 * @returns {void}
 */
function renderColumns() {
    renderAllTaskCards(allTasks, 'todo', dragAreaTodo);
    renderAllTaskCards(allTasks, 'inProgress', dragAreaInProgress);
    renderAllTaskCards(allTasks, 'awaitFeedback', dragAreaAwaitFeedback);
    renderAllTaskCards(allTasks, 'done', dragAreaDone);
};


/**
 * Renders all task cards for a specific status column
 * @param {Array} allTasks - Array of all task objects
 * @param {string} state - The status filter to apply ('todo', 'inProgress', etc.)
 * @param {HTMLElement} container - The DOM element to render tasks into
 * @returns {void}
 */
function renderAllTaskCards(allTasks, state, container) {
    const todos = allTasks.filter((task) => task.status === state);
    container.innerHTML = '';
    if (todos.length === 0) {
        container.innerHTML = renderPlaceholder();
        return;
    }
    todos.forEach((task) => {
        container.innerHTML += getTaskCard(task);
    });
};


/**
 * Handles the start of dragging a task
 * @param {DragEvent} event - The drag start event
 * @param {string} taskId - ID of the task being dragged
 * @returns {void}
 */
function startDragging(event, taskId) { // ich bin nicht ok
    const draggedElement = event.target.closest('.task_card');
    event.dataTransfer.setData('text/plain', taskId);
    draggedElement.classList.add('dragging');
    const dimensions = {
        width: draggedElement.offsetWidth,
        height: draggedElement.offsetHeight
    };
    try {
        event.dataTransfer.setData('application/json', JSON.stringify(dimensions));
    } catch (e) {
        console.log('Browser does not support complex data types in dataTransfer');
    };
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
};

/**
 * Enables dropping by preventing default behavior and showing a visual placeholder
 * @param {DragEvent} event - The drag over event
 * @returns {void}
 */
function allowDrop(event) { // erkläre mich
    event.preventDefault();
    const dropzone = event.currentTarget;
    let dimensionsStr = event.dataTransfer.getData('dimensions');
    if (!dimensionsStr) {
        dimensionsStr = sessionStorage.getItem('draggedElementDimensions');
    }
    const dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
    removePlaceholders();
    if (dimensions.width && dimensions.height) {
        const placeholder = createPlaceholder(dimensions);
        dropzone.appendChild(placeholder);
    }
};

/**
 * Creates a placeholder element to show where the dragged item will be placed
 * @param {Object} dimensions - Width and height of the placeholder
 * @param {number} dimensions.width - Width in pixels
 * @param {number} dimensions.height - Height in pixels
 * @returns {HTMLElement} - The created placeholder element
 */
function createPlaceholder(dimensions) { // ich bin nicht ok
    const placeholder = document.createElement('div');
    placeholder.className = 'drag_area_placeholder';
    placeholder.style.width = `${dimensions.width}px`;
    placeholder.style.height = `${dimensions.height}px`;
    return placeholder;
};

/**
 * Removes all placeholder elements from the document
 * @returns {void}
 */
function removePlaceholders() {
    document.querySelectorAll('.drag_area_placeholder').forEach(placeholder => {
        placeholder.remove();
    });
};

/**
 * Handles the drop event when a task is released in a drop zone
 * @param {DragEvent} event - The drop event
 * @returns {void}
 */
function handleDrop(event) { // ich bin zu gross
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const dropzone = event.currentTarget;
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    removePlaceholders();
    sessionStorage.removeItem('draggedElementDimensions');
    let targetStatus;
    if (dropzone.id === 'drag_area_todo') targetStatus = 'todo';
    else if (dropzone.id === 'drag_area_in_progress') targetStatus = 'inProgress';
    else if (dropzone.id === 'drag_area_await_feedback') targetStatus = 'awaitFeedback';
    else if (dropzone.id === 'drag_area_done') targetStatus = 'done';
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    };
};

/**
 * Handles the end of a drag operation
 * @param {DragEvent} event - The drag end event
 * @returns {void}
 */
function handleDragEnd(event) {
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    removePlaceholders();
    sessionStorage.removeItem('draggedElementDimensions');
};

/**
 * Sets up all drag areas with event listeners for drag and drop functionality
 * @returns {void}
 */
function setupDragAreas() { // erkläre mich
    const dragAreas = [dragAreaTodo, dragAreaInProgress, dragAreaAwaitFeedback, dragAreaDone];
    dragAreas.forEach(area => {
        area.ondragover = allowDrop;
        area.ondrop = handleDrop;
    });
    document.addEventListener('dragend', handleDragEnd);
};

/**
 * Moves a task to a new status column and updates the database
 * @async
 * @param {string} taskId - ID of the task to move
 * @param {string} targetStatus - The new status for the task
 * @returns {Promise<void>}
 */
async function moveTo(taskId, targetStatus) {
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    allTasks[taskIndex].status = targetStatus;
    const task = allTasks[taskIndex];
    await updateTaskStatus(taskId, targetStatus);
    renderColumns();
};

/**
 * Updates a task's status in the Firebase database
 * @async
 * @param {string} taskId - ID of the task to update
 * @param {string} status - New status value
 * @returns {Promise<void>}
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
};

// /**
//  * Generates HTML for a single task card
//  * @param {Object} task - Task object containing all task properties
//  * @param {string} task.id - The unique identifier for the task
//  * @param {string} task.title - The title of the task
//  * @param {string} task.description - The description of the task
//  * @param {string} task.dueDate - The due date of the task
//  * @param {string} task.priority - The priority level of the task
//  * @returns {string} HTML string for the task card
//  */
// function getTaskCard(task) {
//     if (!task) {
//         console.error('Attempted to render a task card for undefined');
//         return '';
//     }
    
//     return `
//         <div class="task_card" draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${task.id}">
//             <div class="task_card_content">
//                 <h3 class="task_card_title">${task.title || 'No Title'}</h3>
//                 <p class="task_card_description">${task.description || 'No Description'}</p>
//                 <div class="task_card_footer">
//                     <span class="task_card_due_date">${task.dueDate || ''}</span>
//                     <span class="task_card_priority">${task.priority || ''}</span>
//                 </div>
//             </div>
//         </div>
//     `;
// };

/**
 * Generates the HTML template for the mobile sidebar
 * @returns {string} HTML string for mobile sidebar
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
};

/**
 * Renders the appropriate sidebar based on screen size
 * @returns {void}
 */
function renderSidebar() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');
    /**
     * Renders the desktop version of the sidebar
     * @returns {void}
     */
    function renderSidebarDesktop() {
        navbarMobileContainer.innerHTML = '';
        mainContainer.innerHTML = getSidebarTemplate();
        navContainer.style.display = 'block';
    };
    /**
     * Renders the mobile version of the sidebar
     * @returns {void}
     */
    function renderSidebarMobile() {
        mainContainer.innerHTML = '';
        navbarMobileContainer.innerHTML = getSidebarTemplateMobile();
        navContainer.style.display = 'none';
    };
    /**
     * Checks screen size and renders the appropriate sidebar
     * @returns {void}
     */
    function checkScreenSize() {
        const width = window.innerWidth;
        if (width < 1050) {
            renderSidebarMobile();
        } else {
            renderSidebarDesktop();
        };
    };
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
};