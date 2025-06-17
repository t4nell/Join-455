let BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
allTasks = window.allTasks || [];

/**
 * Finds the task card element being dragged
 * 
 * @param {Event} event - The drag event
 * @returns {HTMLElement} The dragged task card element
 */
function getDraggedElement(event) {
    return event.target.closest('.task_card');
};


/**
 * Allows dropping by preventing the default behavior and adding a placeholder
 * 
 * @param {Event} event - The dragover event
 */
function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    const dimensions = getCardDimensions();
    removePlaceholders();
    if (dimensions.width && dimensions.height) {
        createAndInsertPlaceholder(dropzone, dimensions, event);
    }
};


/**
 * Gets the dimensions of the card currently being dragged
 * 
 * @returns {Object} Object with width and height properties
 */
function getCardDimensions() {
    const dimensionsString = sessionStorage.getItem('draggedElementDimensions') || '{}';
    return JSON.parse(dimensionsString);
};


/**
 * Creates a placeholder and inserts it at the right position based on mouse location
 * 
 * @param {HTMLElement} dropzone - The container element
 * @param {Object} dimensions - The width and height of the placeholder
 * @param {Event} event - The dragover event
 */
function createAndInsertPlaceholder(dropzone, dimensions, event) {
    const placeholder = createPlaceholder(dimensions);
    setupPlaceholderEvents(placeholder);
    const mouseY = event.clientY;
    const rect = dropzone.getBoundingClientRect();
    const mousePosition = mouseY - rect.top;
    insertPlaceholderAtPosition(dropzone, placeholder, mousePosition);
};


/**
 * Starts the dragging process for a task
 * 
 * @param {Event} event - The dragstart event
 * @param {string} taskId - ID of the task being dragged
 */
function startDragging(event, taskId) {
    const draggedElement = getDraggedElement(event);
    event.dataTransfer.setData('text/plain', taskId);
    draggedElement.classList.add('dragging');
    saveCardDimensions(draggedElement);
};


/**
 * Saves the dimensions of a card to session storage
 * 
 * @param {HTMLElement} element - The element to measure
 */
function saveCardDimensions(element) {
    const dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
};


/**
 * Handles when a task is dropped into a column
 * 
 * @param {Event} event - The drop event
 */
function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const dropzone = event.currentTarget;
    cleanupAfterDrop();
    const targetStatus = getColumnStatus(dropzone);
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    }
};


/**
 * Removes visual effects and stored data after drop
 * 
 * @returns {void} Removes drag data and visual effects after drop
 */
function cleanupAfterDrop() {
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    removePlaceholders();
    sessionStorage.removeItem('draggedElementDimensions');
};


/**
 * Gets the status based on which column an element was dropped in
 * 
 * @param {HTMLElement} dropzone - The column element
 * @returns {string} The status (todo, inProgress, etc.)
 */
function getColumnStatus(dropzone) {
    const statusMap = {
        'drag_area_todo': 'todo',
        'drag_area_in_progress': 'inProgress',
        'drag_area_await_feedback': 'awaitFeedback',
        'drag_area_done': 'done'
    };
    return statusMap[dropzone.id];
};


/**
 * Updates a task's status in the database
 * 
 * @param {string} taskId - ID of the task to update
 * @param {string} status - The new status value
 */
async function updateTaskStatus(taskId, status) {
    try {
        const existingTask = await getTaskFromDatabase(taskId);
        if (!existingTask) {
            console.error('Task not found:', taskId);
            return;
        }
        await saveTaskWithNewStatus(taskId, existingTask, status);
    } catch (error) {
        console.error('Error updating task status:', error);
    }
};


/**
 * Gets a task from the database by ID
 * 
 * @param {string} taskId - ID of the task to get
 * @returns {Promise<Object>} The task object from the database
 */
async function getTaskFromDatabase(taskId) {
    const response = await fetch(`${BASE_URL}addTask/${taskId}.json`);
    return await response.json();
};


/**
 * Saves a task with its new status to the database
 * 
 * @param {string} taskId - ID of the task
 * @param {Object} existingTask - The current task data
 * @param {string} newStatus - The new status value
 */
async function saveTaskWithNewStatus(taskId, existingTask, newStatus) {
    await fetch(`${BASE_URL}addTask/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify({ 
            ...existingTask, 
            status: newStatus 
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


/**
 * Moves a task to a new column by updating its status
 * 
 * @param {string} taskId - ID of the task to move
 * @param {string} targetStatus - The new status value
 */
async function moveTo(taskId, targetStatus) {
    const taskIndex = findTaskIndex(taskId);
    if (taskIndex === -1) {
        console.error('Task not found:', taskId);
        return;
    }
    allTasks[taskIndex].status = targetStatus;
    await updateTaskStatus(taskId, targetStatus);
    renderColumns();
};


/**
 * Finds the index of a task in the allTasks array
 * 
 * @param {string} taskId - ID of the task to find
 * @returns {number} The index, or -1 if not found
 */
function findTaskIndex(taskId) {
    return allTasks.findIndex(task => 
        String(task.id) === String(taskId)
    );
};


/**
 * Sets up all drag areas with event handlers
 */
function setupDragAreas() {
    const dragAreas = [
        document.getElementById('drag_area_todo'),
        document.getElementById('drag_area_in_progress'),
        document.getElementById('drag_area_await_feedback'),
        document.getElementById('drag_area_done')
    ].filter(Boolean);
    dragAreas.forEach(area => {
        if (area) {
            area.ondragover = allowDrop;
            area.ondrop = handleDrop;
        }
    });
    document.addEventListener('dragend', handleDragEnd);
};


/**
 * Sets up the drag and drop system
 * 
 * @returns {Promise} Promise that resolves when setup is complete
 */
function initDragAndDrop() {
    setupDragAreas();
    return Promise.resolve();
};


/**
 * Template: Shows correct sidebar depending on screen size.
 * 
 * @param {number} breakpoint - The screen width to switch between mobile and desktop.
 * @param {string} desktopContainerId - ID of the desktop navbar container.
 * @param {string} sidebarId - ID of the sidebar container.
 * @param {string} mobileContainerId - ID of the mobile navbar container.
 * @param {Function} desktopTemplateFn - Function that returns HTML for desktop sidebar.
 * @param {Function} mobileTemplateFn - Function that returns HTML for mobile sidebar.
 */
function setupResponsiveSidebar(breakpoint, desktopContainerId, sidebarId, mobileContainerId, desktopTemplateFn, mobileTemplateFn) {
    const main = document.getElementById(desktopContainerId);
    const side = document.getElementById(sidebarId);
    const mobile = document.getElementById(mobileContainerId);
    function updateSidebar() {
        const isMobile = window.innerWidth < breakpoint;
        main.innerHTML = isMobile ? '' : desktopTemplateFn();
        mobile.innerHTML = isMobile ? mobileTemplateFn() : '';
        side.style.display = isMobile ? 'none' : 'block';
    }
    window.addEventListener('resize', updateSidebar);
    updateSidebar();
};


/**
 * Sets up event handlers for the placeholder element
 * 
 * @param {HTMLElement} placeholder - The placeholder element
 */
function setupPlaceholderEvents(placeholder) {
    placeholder.ondragover = (e) => { 
        e.preventDefault();
        e.stopPropagation();
    };
    placeholder.ondrop = handlePlaceholderDrop;
};


/**
 * Handles drops directly onto a placeholder
 * 
 * @param {Event} e - The drop event
 */
function handlePlaceholderDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget.parentElement;
    if (!dropzone) return;
    const taskId = e.dataTransfer.getData('text/plain');
    const targetStatus = getColumnStatus(dropzone);
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    };
    cleanupAfterDrop();
};


/**
 * Places a placeholder at the right position based on mouse position
 * 
 * @param {HTMLElement} dropzone - The container element
 * @param {HTMLElement} placeholder - The placeholder element
 * @param {number} mouseY - Vertical mouse position
 */
function insertPlaceholderAtPosition(dropzone, placeholder, mouseY) {
    const items = getNonPlaceholderItems(dropzone);
    if (items.length === 0) {
        dropzone.appendChild(placeholder);
        return;
    }
    const insertPosition = findInsertPosition(items, mouseY, dropzone);
    insertPlaceholder(dropzone, placeholder, items, insertPosition);
};


/**
 * Gets all items in a container except placeholders
 * 
 * @param {HTMLElement} container - The container element
 * @returns {Array} Array of non-placeholder elements
 */
function getNonPlaceholderItems(container) {
    return Array.from(container.children).filter(child => 
        !child.classList.contains('drag_area_placeholder')
    );
};


/**
 * Finds where to insert the placeholder based on mouse position
 * 
 * @param {Array} items - Array of items in the container
 * @param {number} mouseY - Vertical mouse position
 * @param {HTMLElement} dropzone - The container element
 * @returns {number} The index where the placeholder should be inserted
 */
function findInsertPosition(items, mouseY, dropzone) {
    let insertPosition = items.length;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemRect = item.getBoundingClientRect();
        const dropzoneRect = dropzone.getBoundingClientRect();
        const itemTop = itemRect.top - dropzoneRect.top;
        const itemMiddle = itemTop + itemRect.height / 2;
        if (mouseY < itemMiddle) {
            insertPosition = i;
            break;
        };
    };
    return insertPosition;
};


/**
 * Inserts a placeholder at a specific position
 * 
 * @param {HTMLElement} dropzone - The container element
 * @param {HTMLElement} placeholder - The placeholder element
 * @param {Array} items - Array of items in the container
 * @param {number} position - Where to insert the placeholder
 */
function insertPlaceholder(dropzone, placeholder, items, position) {
    if (position === items.length) {
        dropzone.appendChild(placeholder);
    } else {
        dropzone.insertBefore(placeholder, items[position]);
    }
};


/**
 * Removes all placeholder elements from task columns
 * 
 * @returns {void} Removes all elements with class 'drag_area_placeholder'
 */
function removePlaceholders() {
    document.querySelectorAll('.drag_area_placeholder').forEach(placeholder => {
        placeholder.remove();
    });
};


/**
 * Handles cleanup and UI updates when drag operation ends
 * 
 * @param {DragEvent} event - The drag end event object
 * @returns {void} Removes drag effects and updates task positions
 */
function handleDragEnd(event) {
    cleanupAfterDrop();
};