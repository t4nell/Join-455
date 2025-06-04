let BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

// Reference to allTasks from board.js
allTasks = window.allTasks || [];

/**
 * Gets the dragged element from the event
 */
function getDraggedElement(event) {
    // Get the closest parent with the task_card class
    return event.target.closest('.task_card');
}

function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    const dimensions = JSON.parse(sessionStorage.getItem('draggedElementDimensions') || '{}');
    
    // Remove all existing placeholders
    removePlaceholders();
    
    // Create new placeholder if dimensions are available
    if (dimensions.width && dimensions.height) {
        const placeholder = createPlaceholder(dimensions);
        
        // Position den Platzhalter an der Mausposition statt ihn als letztes Kind hinzuzufügen
        const mouseY = event.clientY;
        const rect = dropzone.getBoundingClientRect();
        const mousePositionRelativeToDropzone = mouseY - rect.top;
        
        // Füge den Platzhalter an der entsprechenden Position ein
        insertPlaceholderAtPosition(dropzone, placeholder, mousePositionRelativeToDropzone);
    }
}

/**
 * Startet den Drag-Vorgang
 */
function startDragging(event, taskId) {
    console.log("startDragging called with taskId:", taskId);
    const draggedElement = getDraggedElement(event);
    
    // Für Chrome wichtig: nur Text-Daten setzen
    event.dataTransfer.setData('text/plain', taskId);
    
    // Visuelle Effekte während des Ziehens
    draggedElement.classList.add('dragging');
    
    // Speichere Dimensionen als Session-Daten (funktioniert browserübergreifend)
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
    
    // In Chrome wichtig: Holen der Daten aus dataTransfer
    const taskId = event.dataTransfer.getData('text/plain');
    const dropzone = event.currentTarget;
    
    // Entferne visuellen Effekt vom Element
    document.querySelectorAll('.task_card.dragging').forEach(element => {
        element.classList.remove('dragging');
    });
    
    // Entferne alle Platzhalter
    removePlaceholders();
    
    // Lösche Session-Daten
    sessionStorage.removeItem('draggedElementDimensions');
    
    // Status-Erkennung
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
        // URL aus board.js verwenden
        const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
        
        // Holen des vollständigen Tasks vor dem Update
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`);
        const existingTask = await response.json();
        
        if (!existingTask) {
            console.error('Task nicht gefunden:', taskId);
            return;
        }
        
        // Aktualisiere den Task mit PUT statt PATCH
        await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PUT', // PUT statt PATCH verwenden
            body: JSON.stringify({ ...existingTask, status: status }), // Alle Daten beibehalten, nur Status ändern
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
    
    // Task-ID als String vergleichen!
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
    // Drop-Zonen per ID holen
    const dragAreas = [
        document.getElementById('drag_area_todo'),
        document.getElementById('drag_area_in_progress'),
        document.getElementById('drag_area_await_feedback'),
        document.getElementById('drag_area_done')
    ].filter(Boolean); // Filter für null/undefined-Elemente
    
    dragAreas.forEach(area => {
        if (area) {
            area.ondragover = allowDrop;
            area.ondrop = handleDrop;
        }
    });
    
    // Event-Listener für das Ende des Ziehvorgangs
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
    
    // Wichtig: Event-Listener zum Durchreichen von Drag-Events
    placeholder.ondragover = (e) => { 
        e.preventDefault();
        e.stopPropagation(); // Verhindere Blasen zum Container, damit allowDrop nicht doppelt aufgerufen wird
    };
    
    placeholder.ondrop = (e) => {
        e.preventDefault();
        // Leite das Event an den Eltern-Container weiter
        const dropzone = e.currentTarget.parentElement;
        if (dropzone) {
            const taskId = e.dataTransfer.getData('text/plain');
            
            // Status-Erkennung
            let targetStatus;
            if (dropzone.id === 'drag_area_todo') targetStatus = 'todo';
            else if (dropzone.id === 'drag_area_in_progress') targetStatus = 'inProgress';
            else if (dropzone.id === 'drag_area_await_feedback') targetStatus = 'awaitFeedback';
            else if (dropzone.id === 'drag_area_done') targetStatus = 'done';
            
            if (taskId && targetStatus) {
                moveTo(taskId, targetStatus);
            }
            
            // Aufräumen
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
    
    // Fall 2: Finde die richtige Position für den Platzhalter
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
    
    // Füge den Platzhalter an der richtigen Position ein
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
    
    // Entferne alle Platzhalter
    removePlaceholders();
    
    // Lösche Session-Daten
    sessionStorage.removeItem('draggedElementDimensions');
}