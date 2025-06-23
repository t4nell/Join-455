/**
 * Initializes the add task page by setting up all required components.
 *
 * @returns {Promise<void>} Completes initialization of the page.
 */
async function init() {
    renderTask();
    checkOrientation();
    initSidebar();
    loadAllContactData();
    renderCategories();
    renderHeader();
    updateUserProfile();
}

/**
 * Renders the task creation form in the designated container.
 *
 * @returns {void} Updates the task container with form template.
 */
function renderTask() {
    const taskContainer = document.getElementById('add_task_container');
    taskContainer.innerHTML = renderTaskTemplate();

    datePicker('#due_date');
}

/**
 * Renders the desktop version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for desktop view.
 */
function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate();
    navContainer.style.display = 'block';
}

/**
 * Renders the mobile version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for mobile view.
 */
function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}

/**
 * Initializes the sidebar with event listeners and correct display.
 *
 * @returns {void} Sets up the sidebar responsiveness.
 */
function initSidebar() {
    const mediaQuery = window.matchMedia('(min-width: 1051px)');
    const handleBreakpoint = (placeholder) => {
        proofSize();
    };
    mediaQuery.addEventListener('change', handleBreakpoint);
    proofSize();
}

/**
 * Checks the window size and renders the appropriate sidebar version.
 *
 * @returns {void} Updates the sidebar based on screen width.
 */
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

/**
 * Initializes a date picker on the specified element.
 *
 * @param {string} selectedDate - CSS selector for the date input element.
 * @returns {void} Sets up the flatpickr date picker.
 */
function datePicker(selectedDate) {
    flatpickr(selectedDate, {
        minDate: 'today',
        dateFormat: 'd/m/Y',
        altInput: false,
        firstDayOfWeek: 1,
        disableMobile: 'true',
    });
}

/**
 * Opens the calendar date picker by focusing on the date input field.
 *
 * @returns {void} Focuses on the date input element.
 */
function openCalendar() {
    const calenderInput = document.getElementById('due_date');
    calenderInput.focus();
}

/**
 * Renders the header component in the designated container.
 *
 * @returns {void} Updates the header container with template.
 */
function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * Creates a new task from form data and submits it to the server.
 *
 * @returns {void} Creates and posts the task, then clears the form.
 */
function createTask() {
    const form = document.getElementById('add_task_form');
    const taskData = collectTaskData(form);

    postTask(taskData);
    clearTasks();
    document.getElementById('clear_btn').click();
}

/**
 * Clears all task form input fields and selections.
 *
 * @returns {void} Resets the form to its default state.
 */
function clearTasks() {
    document.getElementById('new_tag_container').innerHTML = '';
    document.getElementById('selected_users_group').innerHTML = '';
    document.getElementById('prio_medium').checked = true;

    clearSelectedUserIndices();
    clearSelection();
    switchBtnPriority('medium');
}

/**
 * Validates all required fields in the task form.
 *
 * @returns {void} Creates the task if validation passes.
 */
function validateRequiredFields() {
    const titleValid = validateTitleField();
    const dateValid = validateDueDateField();
    const categoryValid = validateCategoryField();

    if (titleValid && dateValid && categoryValid) {
        createTask();
        showAddedNotification('Task added to Board');
    }
}

/**
 * Validates the title input field.
 *
 * @returns {boolean} True if the title is valid, otherwise false.
 */
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

/**
 * Validates the due date input field.
 *
 * @returns {boolean} True if the due date is valid, otherwise false.
 */
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

/**
 * Validates the category dropdown selection.
 *
 * @returns {boolean} True if a category is selected, otherwise false.
 */
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

/**
 * Shows a notification that a task was successfully added.
 *
 * @param {string} notificationText - Text to display in the notification.
 * @returns {void} Shows notification and redirects to board after delay.
 */
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

