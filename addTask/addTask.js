async function init() {
    renderTask();
    checkOrientation();
    initSidebar();
    loadAllContactData();
    renderCategories();
    renderHeader();
    updateUserProfile();
}

function renderTask() {
    const taskContainer = document.getElementById('add_task_container');
    taskContainer.innerHTML = renderTaskTemplate();

    datePicker('#due_date');
}

function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate();
    navContainer.style.display = 'block';
}

function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}

function initSidebar() {
    window.addEventListener('resize', proofSize);
    proofSize();
}

function proofSize() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');
    const width = window.innerWidth;
    if (width < 1051) {
        renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer);
    } else {
        renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer);
    }
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
    savedContactNotification.classList.remove('closed_contact_save_message_addTask');
    savedContactNotification.classList.add('show');

    setTimeout(() => {
        savedContactNotification.classList.remove('show');
        savedContactNotification.classList.add('closed_contact_save_message_addTask');
        window.location.href = '../board/board.html';
    }, 1500);
}

