const mainContainer = document.getElementById('navbar_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
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

let allData = [];
// console.log(new Date().toLocaleTimeString(), 'Alle allData Array:', allData);

function collectTaskData(form) {
    const fd = new FormData(form);
    const subtaskInputs = document.getElementById('new_tag_container');
    const subtasks = Array.from(subtaskInputs).map((input) => input.value.trim());

    const task = {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo: fd.getAll('assigned_to'),
        category: fd.get('category'),
        subtasks: subtasks,
        // subtasks: fd.getAll('subtasks[]'),
    };

    allData.push(task);
    return task;
}

function createTask() {
    const form = document.getElementById('add_task_form');
    const taskData = collectTaskData(form);

    console.log(new Date().toLocaleTimeString(), 'Nur die Category:', taskData.category);
    console.log(new Date().toLocaleTimeString(), 'Alle taskData Object:', taskData);
    console.log(new Date().toLocaleTimeString(), 'Alle allData Array:', allData);
    console.log('priority:', allData[0].priority);
}

function clearSubtasks() {
    document.getElementById('new_tag_container').innerHTML = '';
}

