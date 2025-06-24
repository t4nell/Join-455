let dueDatePicker = null;

let currentBoardStatus = 'todo';

/**
 * Opens the task creation overlay or redirects to the Add Task page on mobile devices.
 *
 * @param {string} boardStatus - The status of the board section where the plus button was clicked
 * @returns {void} Opens overlay or redirects based on screen size.
 */
function openOverlay(boardStatus) {
    const overlayContent = document.getElementById('add_task_container_board');
    const overlay = document.getElementById('overlay');
    const width = window.innerWidth;

    currentBoardStatus = boardStatus;

    if (width > 1050) {
        overlay.classList.remove('fade_out');
        overlayContent.classList.remove('closed');
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
 * Sets up a click listener specifically for the assigned dropdown in the board overlay.
 * This ensures the dropdown can be closed when clicking outside of it.
 *
 * @returns {void} Adds event listener to the overlay content.
 */
function setupAssignedDropdownClickListener() {
    const overlayContent = document.getElementById('add_task_container_board');

    if (overlayContent) {
        overlayContent.addEventListener('click', function (event) {
            const dropdown = document.getElementById('dropdown');
            const toggleBtn = document.getElementById('dropdown_toggle_btn');
            const selectedUser = document.getElementById('selected_users_group');

            if (
                dropdown &&
                toggleBtn &&
                selectedUser &&
                !dropdown.contains(event.target) &&
                !toggleBtn.contains(event.target) &&
                !selectedUser.contains(event.target)
            ) {
                closeAssignedDropdown();
            }
        });
    }
}

/**
 * Closes the task creation overlay and cleans up the datepicker.
 *
 * @returns {void} Hides the overlay and removes the datepicker.
 */
function closeOverlay() {
    const overlayContent = document.getElementById('add_task_container_board');
    const overlay = document.getElementById('overlay');
    overlay.classList.add('fade_out');
    overlayContent.classList.add('closed');
    removeDatePicker('#due_date');
    clearTasks();
}

/**
 * Prevents event propagation for click events.
 *
 * @param {Event} event - The event whose propagation should be stopped.
 * @returns {void} Stops event propagation.
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
 * Destroys a Flatpickr instance associated with the specified selector.
 *
 * @param {string} selector - CSS selector of the input element with attached Flatpickr.
 * @returns {void} Removes the datepicker from the element.
 */
function removeDatePicker(selector) {
    const element = document.querySelector(selector);
    if (element && element._flatpickr) {
        element._flatpickr.destroy();
    }
}

/**
 * Initializes a datepicker on the specified element.
 *
 * @param {string} selectedDate - CSS selector for the date input element.
 * @returns {void} Sets up the Flatpickr datepicker.
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
 * @param {string} boardStatus - The status section where the add task was triggered (todo, inProgress, awaitFeedback)
 * @returns {void} Creates and posts the task, then clears the form.
 */
function createTask(boardStatus = 'todo') {
    const form = document.getElementById('add_task_form');
    const taskData = collectTaskData(form, boardStatus);

    postTask(taskData);
    clearTasks();
}

/**
 * Clears all task form fields and selection options.
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
 * @param {string} boardStatus - The status section where the add task was triggered (todo, inProgress, awaitFeedback)
 * @returns {void} Creates the task if validation is successful.
 */
function validateRequiredFields(boardStatus) {
    const titleValid = validateTitleField();
    const dateValid = validateDueDateField();
    const categoryValid = validateCategoryField();

    if (titleValid && dateValid && categoryValid) {
        createTask(boardStatus);
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
 * Validates the category selection in the dropdown.
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
 * Sets up a click listener specifically for the assigned dropdown in the board overlay.
 * This ensures the dropdown can be closed when clicking outside of it.
 *
 * @returns {void} Adds event listener to the overlay content.
 */
function addClickListenerForDropdown() {
    const overlayContent = document.getElementById('add_task_container_board');

    if (overlayContent) {
        overlayContent.addEventListener('click', function (event) {
            const dropdown = document.getElementById('dropdown');
            const toggleBtn = document.getElementById('dropdown_toggle_btn');
            const selectedUser = document.getElementById('selected_users_group');

            if (
                dropdown &&
                toggleBtn &&
                selectedUser &&
                !dropdown.contains(event.target) &&
                !toggleBtn.contains(event.target) &&
                !selectedUser.contains(event.target)
            ) {
                closeAssignedDropdown();
            }
        });
    }
}

/**
 * Shows a notification that a task was successfully added.
 *
 * @param {string} notificationText - Text to be displayed in the notification.
 * @returns {void} Shows notification and redirects to the board after a delay.
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

