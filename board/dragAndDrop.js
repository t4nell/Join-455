// Reference to allTasks from board.js - KEINE erneute Deklaration hier!

/**
 * Hilfsfunktion zum zuverlässigen Ermitteln des gezogenen Elements
 */
function getDraggedElement(event) {
    return event.target.closest('.task_card') || event.target;
}

/**
 * Erlaubt das Droppen und erstellt einen Platzhalter
 */
function allowDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    const dimensions = JSON.parse(sessionStorage.getItem('draggedElementDimensions') || '{}');
    
    // Remove all existing placeholders
    removePlaceholders();
    
    // Create new placeholder if dimensions are available
    if (dimensions.width && dimensions.height) {
        const placeholder = createPlaceholder(dimensions);
        dropzone.appendChild(placeholder);
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
 * Verschiebt eine Aufgabe zu einem neuen Status
 */
async function moveTo(taskId, targetStatus) {
    // Task-ID als String vergleichen!
    const taskIndex = allTasks.findIndex(task => String(task.id) === String(taskId));
    if (taskIndex === -1) return;
    
    allTasks[taskIndex].status = targetStatus;
    await updateTaskStatus(taskId, targetStatus);
    renderColumns();
}

/**
 * Aktualisiert den Aufgabenstatus in der Datenbank
 */
async function updateTaskStatus(taskId, status) {
    try {
        // URL aus board.js verwenden
        const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
        
        // Aktualisiere nur das status-Feld in Firebase
        await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PATCH', // PATCH statt PUT, um nur status zu aktualisieren
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
    return placeholder;
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