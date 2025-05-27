let menu, selectedUser, dropdown, toggle;
let contactsArray = [];



function initEditTaskVariables() {
    dropdown = document.getElementById('dropdown');
    selectedUser = document.getElementById('selected_users_group');
    menu = document.getElementById('dropdown_menu');
    toggle = document.getElementById('dropdown_toggle_btn');
};

async function loadContactData(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseToJson = await response.json();
        const contactsRef = responseToJson.contact;
        const addTask = Object.values(responseToJson.addTask);
        contactsArray = Object.values(contactsRef);
        contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadContactsToAssigned();
};

function openCalendar() {
    const calenderInput = document.getElementById('due_date');
    calenderInput.focus();
};

document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#due_date', {
        dateFormat: 'd/m/Y',
        minDate: 'today',
        locale: {
            firstDayOfWeek: 1,
        },
    });
});

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
};

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    selectedUser.classList.toggle('d_none');
};

function toggleBackground(index) {
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    clickedItem.classList.toggle('active');
};

function handleClickOutside(event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        selectedUser.classList.remove('d_none');
    }
};

function loadContactsToAssigned() {
    if (!menu) return;
    menu.innerHTML = '';
    contactsArray.forEach((contact, index) => {
        menu.innerHTML += loadContactsToAssignedTemplate(contact, index);
    });
};

function loadContactsToAssignedTemplate(contact, index) {
    const bgColor = contactsArray[index].color;
    const nameInitials = contact.name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
    const surnameInitials = contact.surname
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
    
    return `
    <li class="dropdown_item" id="dropdown_item_${index}" onclick="selectUser(${index}, event)">
    <div class="symbole_name_group">
    <div class="avatar" style="background-color: ${bgColor}">
    <span>${nameInitials}${surnameInitials}</span>
    </div>
    <div>
    <span class="contact_name">${contact.name} ${contact.surname}</span>
    </div>
    </div>
    <input
    id="users_checkbox_${index}"
    class="assign_dropdown_input"
    type="checkbox"
    name="assigned_to"
    value="${contact.name} ${contact.surname}" 
    onclick="selectUser(${index}, event)"/>
    </li>`;
};

// function renderAssignedContactsEdit(assignedTo) {
//     initEditTaskVariables();
//     if (!assignedTo || !selectedUser) return;
//     selectedUser.innerHTML = '';
    
//     for (let index = 0; index < contactsArray.length; index++) {
//         const contact = contactsArray[index];
//         const fullName = `${contact.name} ${contact.surname}`;

//         if (assignedTo[fullName]) {
//             const nameInitials = contact.name
//                 .split(' ')
//                 .map((p) => p.charAt(0).toUpperCase())
//                 .join('');
//             const surnameInitials = contact.surname
//                 .split(' ')
//                 .map((p) => p.charAt(0).toUpperCase())
//                 .join('');
//             const initials = nameInitials + surnameInitials;

//             selectedUser.innerHTML += addSelectedUserIconTemplate(index, contact.color, initials);

//             setTimeout(() => {
//                 const checkBox = document.getElementById(`users_checkbox_${index}`);
//                 if (checkBox) {
//                     checkBox.checked = true;
//                     toggleBackground(index);
//                 }
//             }, 0);
//         }
//     };
// }

function renderAssignedContactsEdit(assignedTo) {
    if (!assignedTo) return '';
    return Object.entries(assignedTo)
        .map(([name, isAssigned]) => {
            if (isAssigned) {
                // Finde den Index des Kontakts im contactsArray
                const index = contactsArray.findIndex(contact => 
                    `${contact.name} ${contact.surname}` === name
                );
                
                const initials = name.split(' ')
                    .map(part => part.charAt(0).toUpperCase())
                    .join('');
                const bgColor = getContactColor(name);
                return `
                    <div id="selected_user_${index}">
                        <div class="avatar" style="background-color: ${bgColor}">
                            ${initials}
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('');
}

function selectUser(index, event) {
    initEditTaskVariables()
    event.stopPropagation();
    const checkbox = document.getElementById(`users_checkbox_${index}`);
    const clickedItem = document.getElementById(`dropdown_item_${index}`);
    if (event.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }
    
    // Entferne zuerst die active Klasse
    clickedItem.classList.remove('active');
    
    // Füge active Klasse nur hinzu wenn checkbox checked ist
    if (checkbox.checked) {
        addSelectedUserIcon(index);
        clickedItem.classList.add('active');
    } else {
        removeSelectedUser(index)
        clickedItem.classList.remove('active');
    }
};

function removeSelectedUser(index) {
    const userIconContainer = document.getElementById(`selected_user_${index}`);
    userIconContainer.remove();
};

function addSelectedUserIcon(index) {
    contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    const bgColor = contactsArray[index].color;
    const contact = contactsArray[index];
    const nameInitials = contact.name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
    const surnameInitials = contact.surname
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
    const initials = nameInitials + surnameInitials;
    
    selectedUser.innerHTML += addSelectedUserIconTemplate(index, bgColor, initials);
};

function addSelectedUserIconTemplate(index, bgColor, initials) {
    return `
        <div id="selected_user_${index}">
           
            <div class="avatar" style="background-color: ${bgColor}">
                
                <div>${initials}</div>
                
            </div>
            
        </div>`;
};

//Die Funktion ist so gross um die refactor Funktion von vscode zu üben ^^
async function saveEditTask(taskId) {
    try {
        const form = document.getElementById('edit_task_form');
        const formData = new FormData(form);
        
        // Get current task to preserve status
        const currentTask = allTasks.find(task => task.id === taskId);
        
        // Collect assigned contacts
        const assignedTo = {};
        const checkboxes = document.querySelectorAll('input[name="assigned_to"]:checked');
        checkboxes.forEach(checkbox => {
            assignedTo[checkbox.value] = true;
        });

        // Collect subtasks
        const subtasks = {};
        const subtaskInputs = document.querySelectorAll('input[name="subtasks"]');
        subtaskInputs.forEach((input, index) => {
            subtasks[`subtask_${index}`] = {
                title: input.value,
                done: false
            };
        });

        // Create updated task object
        const updatedTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('due_date'),
            priority: formData.get('priority'),
            category: currentTask.category,
            assignedTo: assignedTo,
            subtasks: subtasks,
            status: currentTask.status
        };

        // Update in Firebase
        const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
            method: 'PUT',
            body: JSON.stringify(updatedTask),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        // Update local tasks array
        const taskIndex = allTasks.findIndex(task => task.id === taskId);
        allTasks[taskIndex] = {...updatedTask, id: taskId};

        // Close detail view and refresh board
        closeDetailTemplate();
        renderColumns();

    } catch (error) {
        console.error('Error updating task:', error);
    }
}