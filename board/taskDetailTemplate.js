/**
 * Zeigt das Task-Detail Template an
 *
 */
function renderDetailTemplate(taskId) {
    const task = allTasks.find((task) => task.id === taskId);
    if (task) {
        taskDetailCard.innerHTML = getDetailTaskCard(task);
        overlay.classList.remove('fade_out');
        taskDetailCard.classList.remove('closed');
    }
};


/**
 * Schließt das Task-Detail Template
 *
 */
function closeDetailTemplate() {
    overlay.classList.add('fade_out');
    taskDetailCard.classList.add('closed');
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
        .map(([contactId, isAssigned]) => {
            if (!isAssigned) return '';
            const contact = contactsArray.find((c) => c.id === contactId);
            if (!contact) return '';
            const initials = getBatch(contact);
            return getAssignedContactsTemplate(contactId, contact, initials);
        })
        .join('');
};


function getBatch(contact) {
    const nameInitials = contact.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;
    return initials;
};


function renderSubtasksList(subtasks, taskId) {
    if (!subtasks) return '';
    return Object.entries(subtasks)
        .map(([key, subtask]) => getSubtaskTemplate(key, subtask, taskId)
        )
        .join('');
};


async function toggleSubtaskStatus(taskId, subtaskKey, checkbox) {
    const task = allTasks.find((task) => task.id === taskId);
    if (!task || !task.subtasks) return;
    task.subtasks[subtaskKey].done = checkbox.checked;
    const title = task.subtasks[subtaskKey].title;
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}/subtasks/${subtaskKey}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                title: title,
                done: checkbox.checked,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to update subtask status');
        renderColumns();
    } catch (error) {
        console.error('Error updating subtask:', error);
        checkbox.checked = !checkbox.checked;
    };
};


async function openEditTask(taskId) {
    const task = allTasks.find((task) => task.id === taskId);
    if (task) {
        const taskDetailCard = document.querySelector('.task_detail_card');
        taskDetailCard.innerHTML = getEditTaskTemplate(task);
        initEditTaskVariables();
        await loadContactData();
        loadContactsToAssignedEditTask();
        if (task.assignedTo) {
            contactsArray.forEach((contact, index) => {
                const fullName = `${contact.name} ${contact.surname}`;
                if (task.assignedTo[fullName] === true) {
                    const checkbox = document.getElementById(`users_checkbox_${index}_edit_task`);
                    if (checkbox) {
                        checkbox.checked = true;
                        toggleBackgroundEditTask(index);
                    };
                };
            });
        };
        switchBtnPriorityEditTask(task.priority);
    };
    initializeCalendar();
};


async function deleteTask(taskId) {
    try {
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        };
        allTasks = allTasks.filter((task) => task.id !== taskId);
        closeDetailTemplate();
        renderColumns();
    } catch (error) {
        console.error('Error deleting task:', error);
    };
};