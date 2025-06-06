let BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

// Reference to allTasks from board.js
allTasks = window.allTasks || [];

/**
 * Finds the task card element being dragged
 * @param {Event} event - The drag event
 * @returns {HTMLElement} The dragged task card element
 */
function getDraggedElement(event) {
    return event.target.closest('.task_card');
}

/**
 * Allows dropping elements by preventing default behavior
 * @param {Event} event - The dragover event
 */
function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    const dimensions = getDraggedDimensions();
    
    removePlaceholders();
    
    if (hasDimensions(dimensions)) {
        const placeholder = createPlaceholder(dimensions);
        const mousePosition = calculateMousePosition(event, dropzone);
        insertPlaceholderAtPosition(dropzone, placeholder, mousePosition);
    }
}

/**
 * Gets dimensions of dragged element from session storage
 * @returns {Object} Object with width and height properties
 */
function getDraggedDimensions() {
    return JSON.parse(sessionStorage.getItem('draggedElementDimensions') || '{}');
}

/**
 * Checks if dimensions object has valid width and height
 * @param {Object} dimensions - Object with possible width and height
 * @returns {boolean} True if dimensions are valid
 */
function hasDimensions(dimensions) {
    return dimensions.width && dimensions.height;
}

/**
 * Calculates mouse position relative to the dropzone
 * @param {Event} event - The drag event
 * @param {HTMLElement} dropzone - The container element
 * @returns {number} The vertical position relative to dropzone
 */
function calculateMousePosition(event, dropzone) {
    const mouseY = event.clientY;
    const rect = dropzone.getBoundingClientRect();
    return mouseY - rect.top;
}

/**
 * Starts the dragging process for a task
 * @param {Event} event - The dragstart event
 * @param {string} taskId - ID of the task being dragged
 */
function startDragging(event, taskId) {
    console.log("Starting drag for task:", taskId);
    const draggedElement = getDraggedElement(event);
    
    setDragData(event, taskId, draggedElement);
}

/**
 * Sets drag data and visual effects
 * @param {Event} event - The drag event
 * @param {string} taskId - ID of the task
 * @param {HTMLElement} element - The element being dragged
 */
function setDragData(event, taskId, element) {
    event.dataTransfer.setData('text/plain', taskId);
    element.classList.add('dragging');
    
    const dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };
    
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
}

/**
 * Handles drop event when a task is dropped in a column
 * @param {Event} event - The drop event
 */
function handleDrop(event) {
    console.log("Drop event occurred");
    event.preventDefault();
    
    const taskId = event.dataTransfer.getData('text/plain');
    const dropzone = event.currentTarget;
    
    cleanupAfterDrag();
    
    const targetStatus = getTargetStatusFromDropzone(dropzone);
    
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    }
}

/**
 * Removes visual effects and stored data after drag
 */
function cleanupAfterDrag() {
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    
    removePlaceholders();
    sessionStorage.removeItem('draggedElementDimensions');
}

/**
 * Gets the target status based on the dropzone ID
 * @param {HTMLElement} dropzone - The dropzone element
 * @returns {string} The status (todo, inProgress, etc.)
 */
function getTargetStatusFromDropzone(dropzone) {
    const statusMap = {
        'drag_area_todo': 'todo',
        'drag_area_in_progress': 'inProgress',
        'drag_area_await_feedback': 'awaitFeedback',
        'drag_area_done': 'done'
    };
    
    return statusMap[dropzone.id];
}

/**
 * Updates a task's status in the database
 * @param {string} taskId - ID of the task to update
 * @param {string} status - New status value
 */
async function updateTaskStatus(taskId, status) {
    try {
        const existingTask = await fetchTaskById(taskId);
        
        if (!existingTask) {
            console.error('Task not found:', taskId);
            return;
        }
        
        await saveTaskWithNewStatus(taskId, existingTask, status);
        console.log('Task updated successfully:', taskId, status);
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

/**
 * Fetches a task by its ID from the database
 * @param {string} taskId - ID of the task to fetch
 * @returns {Promise<Object>} Promise resolving to the task object
 */
async function fetchTaskById(taskId) {
    const response = await fetch(`${BASE_URL}addTask/${taskId}.json`);
    return await response.json();
}

/**
 * Saves a task with its updated status to the database
 * @param {string} taskId - ID of the task
 * @param {Object} existingTask - The current task data
 * @param {string} status - The new status value
 */
async function saveTaskWithNewStatus(taskId, existingTask, status) {
    await fetch(`${BASE_URL}addTask/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify({ ...existingTask, status: status }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/**
 * Moves a task to a new status column
 * @param {string} taskId - ID of the task to move
 * @param {string} targetStatus - The new status value
 */
async function moveTo(taskId, targetStatus) {
    console.log('Moving task:', taskId, 'to status:', targetStatus);
    
    const taskIndex = findTaskIndex(taskId);
    
    if (taskIndex === -1) {
        console.error('Task not found in allTasks:', taskId);
        return;
    }
    
    allTasks[taskIndex].status = targetStatus;
    await updateTaskStatus(taskId, targetStatus);
    renderColumns();
}

/**
 * Finds the index of a task in the allTasks array
 * @param {string} taskId - ID of the task to find
 * @returns {number} The index, or -1 if not found
 */
function findTaskIndex(taskId) {
    return allTasks.findIndex(task => 
        String(task.id) === String(taskId)
    );
}

/**
 * Sets up all drag areas with event handlers
 */
function setupDragAreas() {
    const dragAreas = getAllDragAreas();
    
    dragAreas.forEach(area => {
        if (area) {
            area.ondragover = allowDrop;
            area.ondrop = handleDrop;
        }
    });
    
    document.addEventListener('dragend', handleDragEnd);
}

/**
 * Gets all drag area elements from the page
 * @returns {Array} Array of drag area elements
 */
function getAllDragAreas() {
    return [
        document.getElementById('drag_area_todo'),
        document.getElementById('drag_area_in_progress'),
        document.getElementById('drag_area_await_feedback'),
        document.getElementById('drag_area_done')
    ].filter(Boolean);
}

/**
 * Initializes the drag and drop functionality
 * @returns {Promise} Promise that resolves when setup is complete
 */
function initDragAndDrop() {
    setupDragAreas();
    return Promise.resolve();
}

/**
 * Creates a visual placeholder element with specified dimensions
 * @param {Object} dimensions - Width and height values
 * @returns {HTMLElement} The created placeholder element
 */
function createPlaceholder(dimensions) {
    const placeholder = document.createElement('div');
    placeholder.className = 'drag_area_placeholder';
    placeholder.style.width = `${dimensions.width}px`;
    placeholder.style.height = `${dimensions.height}px`;
    
    setupPlaceholderEvents(placeholder);
    
    return placeholder;
}

/**
 * Adds event handlers to a placeholder element
 * @param {HTMLElement} placeholder - The placeholder element
 */
function setupPlaceholderEvents(placeholder) {
    placeholder.ondragover = (e) => { 
        e.preventDefault();
        e.stopPropagation();
    };
    
    placeholder.ondrop = handlePlaceholderDrop;
}

/**
 * Handles drop events on placeholder elements
 * @param {Event} e - The drop event
 */
function handlePlaceholderDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget.parentElement;
    
    if (!dropzone) return;
    
    const taskId = e.dataTransfer.getData('text/plain');
    const targetStatus = getTargetStatusFromDropzone(dropzone);
    
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    }
    
    cleanupAfterDrag();
}

/**
 * Inserts a placeholder at the right position based on mouse location
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
    insertAtPosition(dropzone, placeholder, items, insertPosition);
}

/**
 * Gets all items in a container except placeholders
 * @param {HTMLElement} container - The container element
 * @returns {Array} Array of non-placeholder elements
 */
function getNonPlaceholderItems(container) {
    return Array.from(container.children).filter(child => 
        !child.classList.contains('drag_area_placeholder')
    );
}

/**
 * Finds where to insert the placeholder based on mouse position
 * @param {Array} items - Array of items in the container
 * @param {number} mouseY - Vertical mouse position
 * @param {HTMLElement} dropzone - The container element
 * @returns {number} The index where the placeholder should be inserted
 */
function findInsertPosition(items, mouseY, dropzone) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemRect = item.getBoundingClientRect();
        const dropzoneRect = dropzone.getBoundingClientRect();
        const itemTop = itemRect.top - dropzoneRect.top;
        const itemMiddle = itemTop + itemRect.height / 2;
        
        if (mouseY < itemMiddle) {
            return i;
        }
    }
    
    return items.length;
}

/**
 * Inserts a placeholder at the specified position
 * @param {HTMLElement} dropzone - The container element
 * @param {HTMLElement} placeholder - The placeholder element
 * @param {Array} items - Array of items in the container
 * @param {number} position - Where to insert the placeholder
 */
function insertAtPosition(dropzone, placeholder, items, position) {
    if (position === items.length) {
        dropzone.appendChild(placeholder);
    } else {
        dropzone.insertBefore(placeholder, items[position]);
    }
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
 * Handles the end of a drag operation
 * @param {Event} event - The dragend event
 */
function handleDragEnd(event) {
    cleanupAfterDrag();
}