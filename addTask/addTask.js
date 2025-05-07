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

function collectTaskData(form) {
    const fd = new FormData(form);

    return {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo: fd.getAll('assigned_to'),
        category: fd.get('category'),
        subtasks: fd.getAll('subtasks[]'),
    };
}

const form = document.getElementById('add_task_form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskData = collectTaskData(this);
    console.log(taskData);
});

function clearSubtasks() {
    document.getElementById('newTag-container').innerHTML = '';
}

