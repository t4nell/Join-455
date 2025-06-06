function renderSidebar() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');

    function renderSidebarDesktop() {
        navbarMobileContainer.innerHTML = '';
        mainContainer.innerHTML = getSidebarTemplate();
        navContainer.style.display = 'block';
    }

    function renderSidebarMobile() {
        mainContainer.innerHTML = '';
        navbarMobileContainer.innerHTML = getSidebarTemplateMobile();
        navContainer.style.display = 'none';
    }

    function proofSize() {
        const width = window.innerWidth;
        if (width < 1051) {
            renderSidebarMobile();
        } else {
            renderSidebarDesktop();
        }
    }

    window.addEventListener('resize', proofSize);
    proofSize();
}

function init() {
    renderSidebar();
    loadContactData();
    renderCategories();
    renderHeader();
    datePicker('#due_date');
}

function datePicker(selectedDate) {
    flatpickr(selectedDate, {
        minDate: 'today',
        dateFormat: 'd/m/Y',
        altInput: false,
        firstDayOfWeek: 1,
        disableMobile: 'true',
    });
}

function openCalendar() {
    const calenderInput = document.getElementById('due_date');
    calenderInput.focus();
}

function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

function createTask() {
    const form = document.getElementById('add_task_form');
    const taskData = collectTaskData(form);

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
        showAddedNotification('Task added to Board');
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

function showAddedNotification(notificationText) {
    const savedContactNotification = document.getElementById('contact_added_task_notification');
    savedContactNotification.innerHTML = showAddedNotificationTemplate(notificationText);
    savedContactNotification.classList.remove('closed');
    savedContactNotification.classList.add('show');

    setTimeout(() => {
        savedContactNotification.classList.remove('show');
        savedContactNotification.classList.add('closed');
        window.location.href = '../board/board.html';
    }, 1500);
}

