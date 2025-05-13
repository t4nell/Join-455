function allowDrop(event) {
    event.preventDefault();
};

function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
    console.log(taskId);
};

async function moveTo(taskId, targetStatus) {
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    allTasks[taskIndex].status = targetStatus;
    console.log(targetStatus);
    
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


function handleDrop(event) {
    const taskId = event.dataTransfer.getData('text/plain');
    console.log(taskId);
    moveTo(taskId, targetStatus);
};