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

console.log('----------------Test Funktion zum sammeln der Daten----------------------');

function collectTaskData(form) {
    const fd = new FormData(form);
    const assignedToArray = fd.getAll('assigned_to');
    const subtasksArray = fd.getAll('subtasks');
    const todo = 'todo';

    const AssignedTo = {};
    assignedToArray.forEach((person) => {
        AssignedTo[person] = true;
    });

    const subtasks = {};
    subtasksArray.forEach((subtask, index) => {
        subtasks[`subtask_${index}`] = {
            title: subtask,
            done: false,
        };
    });

    const task = {
        Title: fd.get('title'),
        Description: fd.get('description'),
        DueDate: fd.get('due_date'),
        Priority: fd.get('priority'),
        AssignedTo: AssignedTo,
        Category: fd.get('category'),
        Subtasks: subtasks,
        status: todo,
    };

    return task;
}

console.log('----------------Firebase Test Funktion----------------------');
const BASE_URL_Test = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';

function postTask(taskData) {
    console.log('Post Funktioniert');
    // postData('addTask/meinKey', taskData);

    // Deaktivieren DerPost Funktion
    // postData('addTask', taskData);
    // Deaktivieren DerPost Funktion
}

async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL_Test + path + '.json', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    });

    return (responseToJson = await response.json());
}

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
}

function clearSubtasks() {
    document.getElementById('new_tag_container').innerHTML = '';
    document.getElementById('selected_users_group').innerHTML = '';
}

