function allowDrop(event) {
    event.preventDefault();
};

function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
};

function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const dropzone = event.currentTarget;
    let targetStatus;
    if (dropzone.id === 'drag_area_todo') targetStatus = 'todo';
    else if (dropzone.id === 'drag_area_in_progress') targetStatus = 'inProgress';
    else if (dropzone.id === 'drag_area_await_feedback') targetStatus = 'awaitFeedback';
    else if (dropzone.id === 'drag_area_done') targetStatus = 'done';
    if (taskId && targetStatus) {
        moveTo(taskId, targetStatus);
    }
};

async function moveTo(taskId, targetStatus) {
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    allTasks[taskIndex].status = targetStatus;
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: targetStatus
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Fehler beim Aktualisieren des Tasks');
        renderColumns();
    } catch (error) {
        console.error('Fehler beim Verschieben des Tasks:', error);
    };
};

