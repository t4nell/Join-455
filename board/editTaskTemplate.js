let menu, selectedUser, dropdown, toggle;
let contactsArray = [];


function initEditTaskVariables() {
    dropdown = document.getElementById('dropdown_edit_task');
    selectedUser = document.getElementById('selected_user_group_edit_task');
    menu = document.getElementById('dropdown_menu_edit_task');
    toggle = document.getElementById('dropdown_toggle_btn_edit_task');
};


function initializeCalendar() {
    const calendarInput = document.getElementById('due_date_edit_task');
    if (calendarInput && !calendarInput._flatpickr) {
        flatpickr(calendarInput, {
            dateFormat: 'd/m/Y',
            minDate: 'today',
            locale: {
                firstDayOfWeek: 1
            }
        });
    };
};


function openCalendar() {
    const calenderInput = document.getElementById('due_date_edit_task');
    if (calenderInput && calenderInput._flatpickr) {
        calenderInput._flatpickr.open();
    } else {
        console.error('Flatpickr not initialized');
    }
};


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
    loadContactsToAssignedEditTask();
};


function switchBtnPriorityEditTask(btnPriority) {
    document.getElementById('icon_urgent_edit_task').src = '../assets/imgs/boardIcons/priorityUrgent.svg';
    document.getElementById('icon_medium_edit_task').src = '../assets/imgs/boardIcons/priorityMedium.svg';
    document.getElementById('icon_low_edit_task').src = '../assets/imgs/boardIcons/priorityLow.svg';
    switch (btnPriority) {
        case 'Urgent':
            document.getElementById('icon_urgent_edit_task').src = '../assets/imgs/boardIcons/priorityUrgentIconWhite.svg';
            break;
        case 'Medium':
            document.getElementById('icon_medium_edit_task').src = '../assets/imgs/boardIcons/priorityMediumIconWhite.svg';
            break;
        case 'Low':
            document.getElementById('icon_low_edit_task').src = '../assets/imgs/boardIcons/priorityLowIconWhite.svg';
            break;
    };
};


function toggleDropdownAssignedEditTask(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
};


function toggleBackgroundEditTask(index) {
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    clickedItem.classList.toggle('active');
};


function handleClickOutsideEditTask(event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
    };
};


function loadContactsToAssignedEditTask() {
    if (!menu) return;
    menu.innerHTML = '';
    contactsArray.forEach((contact) => {
        menu.innerHTML += loadContactsToAssignedTemplateEditTask(contact);
    });
};


function loadContactsToAssignedTemplateEditTask(contact) {
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
    return createContactListItem(activeClass, contact, bgColor, nameInitials, surnameInitials, checkedAttr);
};


function renderAssignedContactsEditTask(assignedTo) {
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
            return generateContactBadge(contactId, contact, initials);
        })
        .join('');
};


function selectUserEditTask(id, event) {
    initEditTaskVariables();
    event.stopPropagation();
    const checkbox = document.getElementById(`users_checkbox_${id}_edit_task`);
    const clickedItem = document.getElementById(`dropdown_item_${id}`);
    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }
    const contact = contactsArray.find(c => c.id === id);
    if (!contact) return;
    if (checkbox.checked) {
        addSelectedUserIconEditTask(contact);
        clickedItem.classList.add('active');
    } else {
        removeSelectedUserEditTask(id);
        clickedItem.classList.remove('active');
    };
};


function removeSelectedUserEditTask(id) {
    const userIconContainer = document.getElementById(`selected_user_${id}`);
    if (userIconContainer) {
        userIconContainer.remove();
    };
};


function addSelectedUserIconEditTask(contact) {
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
};


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


async function saveEditTask(taskId) {
    try {
        const { currentTask, formData, assignedTo } = contactsCollects(taskId);  // Collect contacts
        let { subtaskIndex, subtasks } = subtasksCollect(currentTask);  // Collect subtasks
        newSubtask(subtaskIndex, subtasks);  // add new Subtask
        const updatedTask = createUpdatedTaskObject(formData, currentTask, assignedTo, subtasks);  // Create updated task object
        const response = await firebaseUpdate(taskId, updatedTask);  // Update in Firebase
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        const taskIndex = allTasks.findIndex((task) => task.id === taskId);
        allTasks[taskIndex] = { ...updatedTask, id: taskId };
        closeDetailTemplate();
        renderColumns();
    } catch (error) {
        console.error('Error updating task:', error);
    };
};


async function firebaseUpdate(taskId, updatedTask) {
    return await fetch(`${BASE_URL}addTask/${taskId}.json`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


function createUpdatedTaskObject(formData, currentTask, assignedTo, subtasks) {
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
};


function newSubtask(subtaskIndex, subtasks) {
    const newSubtaskInput = document.getElementById('tag_input_field_edit_task');
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