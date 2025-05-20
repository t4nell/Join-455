/**
 * Zeigt das Task-Detail Template an
 * 
 */
function renderDetailTemplate(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    if (task) {
        taskDetailCard.innerHTML = getDetailTaskCard(task);
        overlay.classList.remove("fade_out");
        taskDetailCard.classList.remove("closed");
    }
};

/**
 * Schließt das Task-Detail Template
 * 
 */
function closeDetailTemplate() {
    overlay.classList.add("fade_out");
    taskDetailCard.classList.add("closed");
};

/**
 * Verhindert das Schließen beim Klick auf die Karte
 * 
 */
function eventBubbling(event) {
    event.stopPropagation();
};

function renderAssignedContacts(assignedTo) {
    if (!assignedTo) return '';
    return Object.entries(assignedTo)
        .map(([name, isAssigned]) => {
            if (isAssigned) {
                const initials = name.split(' ')
                    .map(part => part.charAt(0).toUpperCase())
                    .join('');
                const bgColor = getContactColor(name);
                return `
                    <div class="contact_badge">
                        <div class="avatar" style="background-color: ${bgColor}">
                            ${initials}
                        </div>
                        <span>${name}</span>
                    </div>
                `;
            }
            return '';
        }).join('');
};

function renderAssignedContactsEdit(assignedTo) {
    if (!assignedTo) return '';
    return Object.entries(assignedTo)
        .map(([name, isAssigned]) => {
            if (isAssigned) {
                const initials = name.split(' ')
                    .map(part => part.charAt(0).toUpperCase())
                    .join('');
                const bgColor = getContactColor(name);
                return `
                    <div class="contact_badge">
                        <div class="avatar" style="background-color: ${bgColor}">
                            ${initials}
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('');
};

function renderSubtasksList(subtasks, taskId) {
    if (!subtasks) return '';
    return Object.entries(subtasks).map(([key, subtask]) => `
        <div class="subtask_item">
            <div class="subtask_background">
                <input type="checkbox" class= "subtask_chbox"
                       id="subtask_${key}" 
                       ${subtask.done ? 'checked' : ''} 
                       onchange="toggleSubtaskStatus('${taskId}', '${key}', this)">
                <label for="subtask_${key}">${subtask.title}</label>
            </div>
        </div>
    `).join('');
};

async function toggleSubtaskStatus(taskId, subtaskKey, checkbox) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task || !task.subtasks) return;
    task.subtasks[subtaskKey].done = checkbox.checked;
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}/subtasks/${subtaskKey}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                done: checkbox.checked
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to update subtask status');
        renderColumns();
    } catch (error) {
        console.error('Error updating subtask:', error);
        checkbox.checked = !checkbox.checked;
    }
};

async function openEditTask(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    if (task) {
        const taskDetailCard = document.querySelector('.task_detail_card');
        taskDetailCard.innerHTML = getEditTaskTemplate(task);
        initEditTaskVariables();
        handleClickOutside(event)
        loadContactsToAssigned();
        switchBtnPriority(task.priority);
    }
}