let dueDatePicker = null;

/**
 * Opens the task creation overlay or redirects to the add task page on mobile.
 *
 * @returns {void} Opens overlay or redirects based on screen size.
 */
function openOverlay() {
    const width = window.innerWidth;
    if (width > 1050) {
        const overlay = document.getElementById('overlay');
        overlay.classList.remove('d_none');
        initAll();
    } else {
        window.location.href = '../addTask/addTask.html';
    }
}

/**
 * Initializes all required data and components for the task creation overlay.
 *
 * @returns {void} Loads contacts, renders task board and categories.
 */
function initAll() {
    loadAllContactData();
    renderTaskBoard();
    renderCategories();
}

/**
 * Closes the task creation overlay and cleans up date picker.
 *
 * @returns {void} Hides the overlay and removes date picker.
 */
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('d_none');
    removeDatePicker('#due_date');
}

/**
 * Prevents event propagation for click events.
 *
 * @param {Event} event - The event to stop propagation for.
 * @returns {void} Stops the event from bubbling up.
 */
function bubbling(event) {
    event.stopPropagation();
}

/**
 * Renders the task creation form in the board overlay.
 *
 * @returns {void} Updates the task container with the board template.
 */
function renderTaskBoard() {
    const taskContainer = document.getElementById('add_task_container_board');
    taskContainer.innerHTML = '';
    taskContainer.innerHTML = renderTaskBoardTemplate();

    datePicker('#due_date');
}

/**
 * Destroys a Flatpickr instance associated with the given selector.
 *
 * @param {string} selector - CSS selector of the input element with Flatpickr attached.
 * @returns {void} Removes the date picker from the element.
 */
function removeDatePicker(selector) {
    const element = document.querySelector(selector);
    if (element && element._flatpickr) {
        element._flatpickr.destroy();
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
    savedContactNotification.classList.remove('closed');
    savedContactNotification.classList.add('show');

    setTimeout(() => {
        savedContactNotification.classList.remove('show');
        savedContactNotification.classList.add('closed');
        window.location.href = '../board/board.html';
    }, 1500);
}

