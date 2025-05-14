const mainContainer = document.getElementById('navbar_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
    initFetch();
}

document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#due_date', {
        dateFormat: 'd/m/Y',
        minDate: 'today',
        locale: {
            firstDayOfWeek: 1,
        },
    });
});

function openCalendar() {
    const calenderInput = document.getElementById('due_date');
    calenderInput.focus();
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

console.log('----------------Creat Task Button Funktion----------------------');
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

    createTaskBtnDisable();
}

function clearTasks() {
    document.getElementById('new_tag_container').innerHTML = '';
    document.getElementById('selected_users_group').innerHTML = '';
    document.getElementById('prio_medium').checked = true;
    switchBtnPriority('medium');
}

function createTaskBtnEnable() {
    const creatTaskBtn = document.getElementById('create_task_btn');
    const titelInput = document.getElementById('title').value;
    const dueDate = document.getElementById('due_date').value;
    const category = document.getElementById('category_dropdown_input').value;

    console.log(titelInput);
    console.log(dueDate);
    console.log(category);

    if (titelInput && dueDate && category) {
        creatTaskBtn.disabled = false;
    } else {
        creatTaskBtn.disabled = true;
    }
}

function createTaskBtnDisable() {
    const creatTaskBtn = document.getElementById('create_task_btn');
    creatTaskBtn.disabled = true;
}

