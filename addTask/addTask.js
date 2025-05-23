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

