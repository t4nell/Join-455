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
// console.log(new Date().toLocaleTimeString());

let addTaskAllData = [];
// console.log(new Date().toLocaleTimeString(), 'Alle allData Array:', allData);

function collectTaskData(form) {
    const fd = new FormData(form);
    // const subtaskInputs = document.getElementById('new_tag_container');
    // const subtasks = Array.from(subtaskInputs).map((input) => input.value.trim());

    const task = {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo: fd.getAll('assigned_to'),
        category: fd.get('category'),
        // subtasks: subtasks,
        // subtasks: fd.getAll('subtasks[]'),
        subtasks: fd.getAll('subtasks'),
    };

    addTaskAllData.push(task);
    return task;
}

function createTask() {
    const form = document.getElementById('add_task_form');
    const taskData = collectTaskData(form);

    // console.log(new Date().toLocaleTimeString(), 'Nur die Category:', taskData.category);
    // console.log(new Date().toLocaleTimeString(), 'Alle taskData Object:', taskData);
    // console.log(new Date().toLocaleTimeString(), 'Alle addTaskAllData Array:', addTaskAllData);
    // console.log('priority:', addTaskAllData[0].priority);

    console.group('addTaskAllData');
    console.table(addTaskAllData);
    console.groupEnd();

    console.group('subtasks');
    console.table(addTaskAllData[0].subtasks);
    console.groupEnd();

    console.group('assignedTo');
    console.table(addTaskAllData[0].assignedTo);
    console.groupEnd();
    postTask();
}

function clearSubtasks() {
    document.getElementById('new_tag_container').innerHTML = '';
}

console.log('----------------Firebase Test Funktion----------------------');
const BASE_URL_Test = 'https://join-test-354db-default-rtdb.firebaseio.com/';

function postTask() {
    console.log('Post Funktioniert');

    // loadData('');

    // postData('ebene1/ebene2', { ebene3: { ebene4: 'wert' } });
    // postData('ebene1/ebene2', { ebene3: { Test: 'wert' } });

    postData('addtask', addTaskAllData);
}

// async function loadData(path = '') {
//     let response = await fetch(BASE_URL + path + '.json');
//     let responseToJson = await response.json();
//     console.log(responseToJson);

//     console.log(responseToJson.addtask.task_1['Assigned to']);
// }

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

