let BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

// Reference to allTasks from board.js
allTasks = window.allTasks || [];

/**
 * Gets the dragged element from the event
 */
function getDraggedElement(event) {
    return event.target.closest('.task_card');
}

function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    const dimensions = JSON.parse(sessionStorage.getItem('draggedElementDimensions') || '{}');
    
    removePlaceholders();
    
    if (dimensions.width && dimensions.height) {
        const placeholder = createPlaceholder(dimensions);
        
        const mouseY = event.clientY;
        const rect = dropzone.getBoundingClientRect();
        const mousePositionRelativeToDropzone = mouseY - rect.top;
        
        insertPlaceholderAtPosition(dropzone, placeholder, mousePositionRelativeToDropzone);
    }
}

/**
 * Startet den Drag-Vorgang
 */
function startDragging(event, taskId) {
    console.log("startDragging called with taskId:", taskId);
    const draggedElement = getDraggedElement(event);
    
    event.dataTransfer.setData('text/plain', taskId);
    
    draggedElement.classList.add('dragging');
    
    const dimensions = {
        width: draggedElement.offsetWidth,
        height: draggedElement.offsetHeight
    };
    sessionStorage.setItem('draggedElementDimensions', JSON.stringify(dimensions));
}

/**
 * Verarbeitet den Drop-Vorgang
 */
function handleDrop(event) {
    console.log("handleDrop called");
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
    }
}

/**
 * Aktualisiert den Aufgabenstatus in der Datenbank
 */
async function updateTaskStatus(taskId, status) {
    try {
        const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
        
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`);
        const existingTask = await response.json();
        
        if (!existingTask) {
            console.error('Task nicht gefunden:', taskId);
            return;
        }
        
        await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify({ ...existingTask, status: status }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Task erfolgreich aktualisiert:', taskId, status);
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

/**
 * Verschiebt eine Aufgabe zu einem neuen Status
 */
async function moveTo(taskId, targetStatus) {
    console.log('moveTo aufgerufen mit:', taskId, targetStatus);
    
    const taskIndex = allTasks.findIndex(task => String(task.id) === String(taskId));
    
    if (taskIndex === -1) {
        console.error('Task nicht gefunden in allTasks:', taskId);
        console.log('Verfügbare Tasks:', allTasks.map(t => t.id));
        return;
    }
    
    allTasks[taskIndex].status = targetStatus;
    await updateTaskStatus(taskId, targetStatus);
    renderColumns();
}

/**
 * Stellt sicher, dass alle Bereiche die ondragover und ondrop Attribute haben
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
}

/**
 * Initialisiert das Drag-and-Drop-System
 */
function initDragAndDrop() {
    setupDragAreas();
    return Promise.resolve();
}

/**
 * Erstellt einen Platzhalter mit den angegebenen Dimensionen
 */
function createPlaceholder(dimensions) {
    const placeholder = document.createElement('div');
    placeholder.className = 'drag_area_placeholder';
    placeholder.style.width = `${dimensions.width}px`;
    placeholder.style.height = `${dimensions.height}px`;
    
    placeholder.ondragover = (e) => { 
        e.preventDefault();
        e.stopPropagation();
    };
    
    placeholder.ondrop = (e) => {
        e.preventDefault();
        const dropzone = e.currentTarget.parentElement;
        if (dropzone) {
            const taskId = e.dataTransfer.getData('text/plain');
            
            let targetStatus;
            if (dropzone.id === 'drag_area_todo') targetStatus = 'todo';
            else if (dropzone.id === 'drag_area_in_progress') targetStatus = 'inProgress';
            else if (dropzone.id === 'drag_area_await_feedback') targetStatus = 'awaitFeedback';
            else if (dropzone.id === 'drag_area_done') targetStatus = 'done';
            
            if (taskId && targetStatus) {
                moveTo(taskId, targetStatus);
            }
            
            document.querySelectorAll('.task_card.dragging').forEach(element => {
                element.classList.remove('dragging');
            });
            removePlaceholders();
            sessionStorage.removeItem('draggedElementDimensions');
        }
    };
    
    return placeholder;
}

/**
 * Fügt einen Platzhalter an der passenden Position basierend auf der Mausposition ein
 */
function insertPlaceholderAtPosition(dropzone, placeholder, mouseY) {
    const items = Array.from(dropzone.children).filter(child => !child.classList.contains('drag_area_placeholder'));
    
    // Fall 1: Container ist leer
    if (items.length === 0) {
        dropzone.appendChild(placeholder);
        return;
    }
    
    let insertPosition = items.length;
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemRect = item.getBoundingClientRect();
        const itemTop = itemRect.top - dropzone.getBoundingClientRect().top;
        const itemMiddle = itemTop + itemRect.height / 2;
        
        if (mouseY < itemMiddle) {
            insertPosition = i;
            break;
        }
    }
    
    if (insertPosition === items.length) {
        dropzone.appendChild(placeholder);
    } else {
        dropzone.insertBefore(placeholder, items[insertPosition]);
    }
}

/**
 * Entfernt alle Platzhalter
 */
function removePlaceholders() {
    document.querySelectorAll('.drag_area_placeholder').forEach(placeholder => {
        placeholder.remove();
    });
}

/**
 * Behandelt das Ende des Drag-Vorgangs
 */
function handleDragEnd(event) {
    // Entferne visuellen Effekt vom Element
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    
    removePlaceholders();
    
    sessionStorage.removeItem('draggedElementDimensions');
}