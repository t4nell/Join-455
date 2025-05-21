const mainContainer = document.getElementById('navbar_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
    initFetch();
}

const dueDatePicker = flatpickr('#due_date', {
    dateFormat: 'd/m/Y',
    minDate: 'today',
    locale: { firstDayOfWeek: 1 },
    allowInput: true,
    altInput: true,
    altFormat: 'd/m/Y',
});

function openCalendar() {
    dueDatePicker.open();
}

function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

window.onload = async function () {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }

        renderSidebar();
        renderHeader();
        updateUserProfile();
        initializeAddTask();
    } catch (error) {
        console.error('Error initializing add task:', error);
    }
};

console.log('----------------Funktion zum sammeln der Daten----------------------');

function collectTaskData(form) {
    const fd = new FormData(form);
    const assignedToArray = fd.getAll('assigned_to');
    const subtasksArray = fd.getAll('subtasks');
    const todo = 'todo';

    const assignedTo = {};
    assignedToArray.forEach((person) => {
        assignedTo[person] = true;
    });

    const subtasks = {};
    subtasksArray.forEach((subtask, index) => {
        subtasks[`subtask_${index}`] = {
            title: subtask,
            done: false,
        };
    });

    const task = {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo: assignedTo,
        category: fd.get('category'),
        subtasks: subtasks,
        status: todo,
    };

    return task;
}

console.log('----------------Firebase POST Funktion----------------------');
const BASE_URL_TWO = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
console.log('----------------Base url ist noch nicht richtig implementiert ?????----------------------');

function postTask(taskData) {
    console.log('Post Funktioniert');
    // postData('addTask/meinKey', taskData);

    // Deaktivieren DerPost Funktion
    // postData('addTask', taskData);
    // Deaktivieren DerPost Funktion
}

async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL_TWO + path + '.json', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    });

    return (responseToJson = await response.json());
}

console.log('----------------Create Task Button Funktion----------------------');
function createTask() {
    const form = document.getElementById('add_task_form');
    const taskData = collectTaskData(form);

    console.group('taskData');
    console.table(taskData);
    console.groupEnd();

    console.group('subtasks');
    console.table(taskData.subtasks);
    console.groupEnd();

    console.group('assignedTo');
    console.table(taskData.assignedTo);
    console.groupEnd();

    postTask(taskData);

    clearTasks();

    document.getElementById('clear_btn').click();
}

function clearTasks() {
    document.getElementById('new_tag_container').innerHTML = '';
    document.getElementById('selected_users_group').innerHTML = '';
    document.getElementById('prio_medium').checked = true;

    clearSelectedUserIndices();
    clearSelection();
    switchBtnPriority('medium');
}

function validateRequiredFields() {
    const titleValid = validateTitleField();
    const dateValid = validateDueDateField();
    const categoryValid = validateCategoryField();

    if (titleValid && dateValid && categoryValid) {
        createTask();
    }
}

function validateTitleField() {
    const titleInput = document.getElementById('title');
    const titleMessage = document.getElementById('required_message_title');

    if (!titleInput.value) {
        titleInput.classList.add('input_title_required');
        titleMessage.style.display = 'block';
        return false;
    } else {
        titleInput.classList.remove('input_title_required');
        titleMessage.style.display = 'none';
        return true;
    }
}

function validateDueDateField() {
    const dueDateInput = document.getElementById('due_date');
    const dateMessage = document.getElementById('required_message_due_date');

    if (!dueDateInput.value) {
        dueDateInput.classList.add('input_date_required');
        dateMessage.style.display = 'block';
        return false;
    } else {
        dueDateInput.classList.remove('input_date_required');
        dateMessage.style.display = 'none';
        return true;
    }
}

function validateCategoryField() {
    const categoryInput = document.getElementById('category_dropdown_input');
    const categoryMessage = document.getElementById('required_message_category');

    if (!categoryInput.value) {
        categoryInput.classList.add('category_dropdown_toggle_required');
        categoryMessage.style.display = 'block';
        return false;
    } else {
        categoryInput.classList.remove('category_dropdown_toggle_required');
        categoryMessage.style.display = 'none';
        return true;
    }
}

