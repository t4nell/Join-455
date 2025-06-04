let menu, selectedUser, dropdown, toggle;
let contactsArray = [];


function initEditTaskVariables() {
    dropdown = document.getElementById('dropdown');
    selectedUser = document.getElementById('selected_user_group');
    menu = document.getElementById('dropdown_menu');
    toggle = document.getElementById('dropdown_toggle_btn');
}


function initializeCalendar() {
    const calendarInput = document.getElementById('due_date');
    if (calendarInput && !calendarInput._flatpickr) {
        flatpickr(calendarInput, {
            dateFormat: 'd/m/Y',
            minDate: 'today',
            locale: {
                firstDayOfWeek: 1
            }
        });
    }
}


function openCalendar() {
    const calenderInput = document.getElementById('due_date');
    if (calenderInput && calenderInput._flatpickr) {
        calenderInput._flatpickr.open();
    } else {
        console.error('Flatpickr not initialized');
    }
}


async function loadContactData(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseToJson = await response.json();
        const contactsRef = responseToJson.contact;
        const addTask = Object.values(responseToJson.addTask);
        contactsArray = Object.entries(contactsRef).map(([id, contact]) => ({
            ...contact,
            id
        }));
        contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadContactsToAssigned();
}


function switchBtnPriority(btnPriority) {
    document.getElementById('icon_urgent').src = '../assets/imgs/boardIcons/priorityUrgent.svg';
    document.getElementById('icon_medium').src = '../assets/imgs/boardIcons/priorityMedium.svg';
    document.getElementById('icon_low').src = '../assets/imgs/boardIcons/priorityLow.svg';
    switch (btnPriority) {
        case 'urgent':
            document.getElementById('icon_urgent').src = '../assets/imgs/boardIcons/priorityUrgentIconWhite.svg';
            break;
        case 'medium':
            document.getElementById('icon_medium').src = '../assets/imgs/boardIcons/priorityMediumIconWhite.svg';
            break;
        case 'low':
            document.getElementById('icon_low').src = '../assets/imgs/boardIcons/priorityLowIconWhite.svg';
            break;
    }
}


function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
}


function toggleBackground(index) {
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    clickedItem.classList.toggle('active');
}


function handleClickOutside(event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
    }
}


function loadContactsToAssigned() {
    if (!menu) return;
    menu.innerHTML = '';
    contactsArray.forEach((contact) => {
        menu.innerHTML += loadContactsToAssignedTemplate(contact);
    });
}


function loadContactsToAssignedTemplate(contact) {
    const bgColor = contact.color;
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const isSelected = document.getElementById(`selected_user_${contact.id}`) !== null;
    const checkedAttr = isSelected ? 'checked' : '';
    const activeClass = isSelected ? 'active' : '';
    return `
    <li class="dropdown_item ${activeClass}" id="dropdown_item_${contact.id}" onclick="selectUser('${contact.id}', event)">
        <div class="symbole_name_group">
            <div class="avatar" style="background-color: ${bgColor}">
                <span>${nameInitials}${surnameInitials}</span>
            </div>
            <div>
                <span class="contact_name">${contact.name} ${contact.surname}</span>
            </div>
        </div>
        <input id="users_checkbox_${contact.id}"
        class="assign_dropdown_input"
        type="checkbox"
        name="assigned_to"
        value="${contact.name} ${contact.surname}" 
        ${checkedAttr}
        onclick="selectUser('${contact.id}', event)"/>
    </li>`;
}


function renderAssignedContactsEdit(assignedTo) {
    if (!assignedTo) return '';
    return Object.entries(assignedTo)
        .map(([contactId, isAssigned]) => {
            if (!isAssigned) return '';
            const contact = contactsArray.find((c) => c.id === contactId);
            if (!contact) return '';
            const nameInitials = contact.name
                .split(' ')
                .map((part) => part.charAt(0).toUpperCase())
                .join('');
            const surnameInitials = contact.surname
                .split(' ')
                .map((part) => part.charAt(0).toUpperCase())
                .join('');
            const initials = nameInitials + surnameInitials;
            return `
                <div id="selected_user_${contactId}" class="contact_badge">
                    <div class="avatar" style="background-color: ${contact.color}">
                        ${initials}
                    </div>
                </div>
            `;
        })
        .join('');
}


function selectUser(id, event) {
    initEditTaskVariables();
    event.stopPropagation();
    const checkbox = document.getElementById(`users_checkbox_${id}`);
    const clickedItem = document.getElementById(`dropdown_item_${id}`);
    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }
    const contact = contactsArray.find(c => c.id === id);
    if (!contact) return;
    if (checkbox.checked) {
        addSelectedUserIcon(contact);
        clickedItem.classList.add('active');
    } else {
        removeSelectedUser(id);
        clickedItem.classList.remove('active');
    }
}


function removeSelectedUser(id) {
    const userIconContainer = document.getElementById(`selected_user_${id}`);
    if (userIconContainer) {
        userIconContainer.remove();
    }
}


function addSelectedUserIcon(contact) {
    const nameInitials = contact.name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;
    selectedUser.innerHTML += addSelectedUserIconTemplate(contact.id, contact.color, initials);
}


function addSelectedUserIconTemplate(id, bgColor, initials) {
    return `
        <div id="selected_user_${id}">
            <div class="avatar" style="background-color: ${bgColor}">
                <div>${initials}</div>
            </div>
        </div>`;
}

function renderEditableSubtasks(task) {
    if (!task.subtasks) return '';
    return Object.entries(task.subtasks).map(([subtaskId, subtask]) => {
        const subtaskNumber = subtaskId.split('_')[1];
        const tagId = `tag_field_${subtaskNumber}`;
        const tagInputId = `new_tag_input_${subtaskNumber}`;
        const tagBtnConId = `new_tag_btn_container_${subtaskNumber}`;
        return renderSubtaskElement(tagId, tagInputId, tagBtnConId, subtask);
    }).join('');

};


function renderSubtaskElement(tagId, tagInputId, tagBtnConId, subtask) {
    return `
    <div class="tag_field" id='${tagId}'>
        <textarea 
            rows="1"
            name="subtasks" 
            class="new_tag_input" 
            id='${tagInputId}' 
            type="text"  
            ondblclick="enableEditing('${tagInputId}', '${tagBtnConId}', '${tagId}')" 
            onblur="disableEditing('${tagInputId}')" 
            oninput="autoResizeTextarea(this)"
            readonly>${subtask.title}</textarea>
        <div id='${tagBtnConId}' class="new_tag_btn_container">
            <div class="btns_position">
                <button class="edit_text_btn" onclick="editTextBtn(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                    <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon"/>
                </button>
                <hr class="separator_vertically_subtasks" />
                <button class="trash_btn" onclick="trashBtn('${tagId}')">
                    <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon"/>
                </button>
            </div>
        </div>
    </div>`;
};


//Die Funktion ist so gross um die refactor Funktion von vscode zu üben
async function saveEditTask(taskId) {
    try {
        // Collect contacts
        const { currentTask, formData, assignedTo } = contactsCollects(taskId);
        // Collect subtasks
        let { subtaskIndex, subtasks } = subtasksCollect(currentTask);
        // Neue Subtask hinzufügen
        newSubtask(subtaskIndex, subtasks);  
        // Create updated task object
        const updatedTask = newFunction(formData, currentTask, assignedTo, subtasks);

        // Update in Firebase
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify(updatedTask),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        // Update local tasks array
        const taskIndex = allTasks.findIndex((task) => task.id === taskId);
        allTasks[taskIndex] = { ...updatedTask, id: taskId };

        // Close detail view and refresh board
        closeDetailTemplate();
        renderColumns();
    } catch (error) {
        console.error('Error updating task:', error);
    }
};


function newFunction(formData, currentTask, assignedTo, subtasks) {
    return {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('due_date'),
        priority: formData.get('priority'),
        category: currentTask.category,
        assignedTo: assignedTo,
        subtasks: subtasks,
        status: currentTask.status,
    };
}

function newSubtask(subtaskIndex, subtasks) {
    const newSubtaskInput = document.getElementById('tag_input_field');
    if (newSubtaskInput && newSubtaskInput.value.trim()) {
        const newSubtaskKey = `subtask_${subtaskIndex}`;
        subtasks[newSubtaskKey] = {
            title: newSubtaskInput.value.trim(),
            done: false
        };
    };
};


function subtasksCollect(currentTask) {
    const subtaskInputs = document.querySelectorAll('textarea[name="subtasks"]');
    const subtasks = {};
    let subtaskIndex = 0;
    subtaskInputs.forEach((input) => {
        if (input.value.trim()) {
            const subtaskKey = `subtask_${subtaskIndex}`;
            const existingSubtask = currentTask.subtasks ?
                currentTask.subtasks[subtaskKey] : null;
            subtasks[subtaskKey] = {
                title: input.value,
                done: existingSubtask ? existingSubtask.done : false
            };
            subtaskIndex++;
        }
    });
    return { subtaskIndex, subtasks };
};


function contactsCollects(taskId) {
    const form = document.getElementById('edit_task_form');
    const formData = new FormData(form);
    const currentTask = allTasks.find((task) => task.id === taskId);
    const assignedTo = {};
    const checkboxes = document.querySelectorAll('input[name="assigned_to"]:checked');
    checkboxes.forEach((checkbox) => {
        const contactId = checkbox.closest('.dropdown_item').id.replace('dropdown_item_', '');
        const contact = contactsArray.find(c => c.id === contactId);
        if (contact) {
            const fullName = `${contact.name} ${contact.surname}`;
            assignedTo[contactId] = {
                [fullName]: true
            };
        }
    });
    return { currentTask, formData, assignedTo };
};