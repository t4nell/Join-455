function openOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('d_none');

    initAll();
    loadAllContactData();
}

function initAll() {
    renderTaskBoard();
    renderCategories();
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('d_none');
}

function bubbling(event) {
    event.stopPropagation();
}

function renderTaskBoard() {
    const taskContainer = document.getElementById('add_task_container_board');
    taskContainer.innerHTML = renderTaskTemplate();

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

// Add Task

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

    // setTimeout(() => {
    //     savedContactNotification.classList.remove('show');
    //     savedContactNotification.classList.add('closed');
    //     window.location.href = '../board/board.html';
    // }, 1500);
}

function renderTaskTemplate() {
    return `
        <div class="title_head">
            <h2>Add Task</h2>
        </div>
        
        <form id="add_task_form" class="main_section">

            <section class="main_section_left">

                <div class="input_title_group">
                    <label for="title" class="required_for_label" onclick="event.preventDefault()">Title</label>
                    <input
                        oninput="validateTitleField()" 
                        name="title"
                        id="title"
                        class="input_title"
                        type="text"
                        placeholder="Enter a title" />
                    <span id="required_message_title" class="required_message">This field is required</span>
                </div>

                <div class="textarea_group">
                    <label for="description" class="input-title" onclick="event.preventDefault()">Description</label>
                    <textarea
                        name="description"
                        class="textarea"
                        id="description"
                        placeholder="Enter a Description"></textarea>
                </div>

                <div class="input_date_group">
                    <label for="due_date" class="required_for_label" onclick="event.preventDefault()">Due date</label>
                    <div class="input_date_container">
                        <input
                            oninput="validateDueDateField()"
                            name="due_date"
                            type="date"
                            id="due_date"
                            placeholder="dd/mm/yyyy"
                            class="input_date"
                            required />
                        <img
                            class="calendar_icon"
                            src="../assets/imgs/addTaskIcons/CalenderIcon.svg"
                            alt="Calendar Icon"
                            onclick="openCalendar()" />
                    </div>
                    <span id="required_message_due_date" class="required_message">This field is required</span>
                </div>

            </section>

            <div class="separator_vertically_gray"></div>

            <section class="main_section_right">
                <div class="radio_btn_container">
                    <span>Priority</span>
                    <div class="priority_btn_group">
                        ${getPriorityButtonsTemplate()}
                    </div>
                </div>

                <div class="assign_to_group">
                    ${getAssignedToTemplate()}
                </div>

                <div class="category_group">
                    ${getCategoryTemplate()}
                </div>

                <div class="tag_input_container">
                    ${getSubtasksTemplate()}
                </div>

            </section>

            <div class="required_footer_text_mobile_container">
                <p class="required_footer_text_mobile show_mobile_required_text_footer">
                    These fields are required
                </p>
            </div>

        </form>

        <footer class="create_task">
            <div>
                <p class="required_footer_text hide_mobile_required_text_footer">* These fields are required</p>
            </div>
            <div class="btn_position">
                ${getTaskButtonsTemplate()}
            </div>
        </footer>

        <div class="navbar_mobile_container_style" id="navbar_mobile_container"></div>

        <div
                onclick="eventBubbling(event)"
                id="contact_added_task_notification"
                class="contact_save_message_addTask center_flex closed">
        </div>

        <div id="landscape_wrapper">
                <div id="landscape_modal" class="landscape_modal d_none">
                    <div class="landscape_modal_content">
                        <svg viewBox="0 0 100 200" class="phone" xmlns="http://www.w3.org/2000/svg">
                            <rect x="10" y="10" width="80" height="180" rx="15" ry="15" fill="#333" />
                            <circle cx="50" cy="180" r="5" fill="#aaa" />
                            <rect x="35" y="20" width="30" height="10" rx="2" ry="2" fill="#666" />
                        </svg>
                        "Please rotate your device to portrait mode for a better experience."
                    </div>
                </div>
            </div>
    `;
}

function getPriorityButtonsTemplate() {
    return `
        <input type="radio" id="prio_urgent" name="priority" value="Urgent" onclick="switchBtnPriority('urgent')" />
        <label for="prio_urgent" class="btn btn--red">
            Urgent
            <img src="../assets/imgs/addTaskIcons/priorityUrgentIcon.svg" alt="Urgent Icon" class="priority_icon" id="icon_urgent"/>
        </label>
        <!-- Medium priority -->
        <input type="radio" id="prio_medium" name="priority" value="Medium" checked onclick="switchBtnPriority('medium')" />
        <label for="prio_medium" class="btn btn--orange">
            Medium
            <img src="../assets/imgs/addTaskIcons/priorityMediumIconWhite.svg" alt="Medium Icon" class="priority_icon" id="icon_medium"/>
        </label>
        <!-- Low priority -->
        <input type="radio" id="prio_low" name="priority" value="Low" onclick="switchBtnPriority('low')" />
        <label for="prio_low" class="btn btn--green">
            Low
            <img src="../assets/imgs/addTaskIcons/priorityLowIcon.svg" alt="Low Icon" class="priority_icon" id="icon_low"/>
        </label>
    `;
}

function getAssignedToTemplate() {
    return `
        <label for="dropdown_toggle_btn" onclick="event.preventDefault()">Assigned to</label>
        <div class="dropdown" id="dropdown">
            <div class="dropdown_input_wrapper">
                <input
                    oninput="filterContacts()"
                    onclick="toggleDropdownAssigned(event)"
                    type="text"
                    id="dropdown_toggle_btn"
                    class="dropdown_toggle"
                    placeholder="Select contacts to assign" />
                <div class="arrow_bg_hover_color">
                    <span class="arrow"></span>
                </div>
            </div>
            <ul class="dropdown_menu" id="dropdown_menu"></ul>
        </div>
        <div id="selected_users_group" class="selected_user_group"></div>
    `;
}

function getCategoryTemplate() {
    return `
        <label class="required_for_label" for="category_dropdown_input" onclick="event.preventDefault()">Category</label>
        <div class="category_dropdown" id="category_dropdown">
            <div class="category_dropdown_input_wrapper">
                <input
                    name="category"
                    type="text"
                    id="category_dropdown_input"
                    class="category_dropdown_toggle"
                    placeholder="Select task category"
                    readonly
                    required
                    onclick="toggleDropdownCategory(event)" />
                <span class="category_arrow_bg_hover_color">
                    <span class="arrow"></span>
                </span>
            </div>
            <span id="required_message_category" class="required_message">This field is required</span>
            <ul class="category_dropdown_menu" id="category_dropdown_menu"></ul>
        </div>
    `;
}

function getSubtasksTemplate() {
    return `
        <label for="tag_input_field" onclick="event.preventDefault()">Subtasks</label>
        <div class="tag_input">
            <input
                type="text"
                placeholder="Add new subtask"
                id="tag_input_field"
                onclick="replaceButtons()"
                oninput="replaceButtons()"
                onkeydown="onKeyDownEnter(event)" />
            <div class="subtask_btn_container" id="subtask_btn_container">
                <button class="plus_btn" onclick="replaceButtons()">
                    <img
                        class="subtasks_icon arrow_bg_hover_color_subtask"
                        src="../assets/imgs/addTaskIcons/subtasksPlusIcon.svg"
                        alt="New Button Icon" />
                </button>
            </div>
        </div>
        <div class="new_tag_container" id="new_tag_container"></div>
    `;
}

function getTaskButtonsTemplate() {
    return `
        <button class="clear_btn" type="reset" form="add_task_form" id="clear_btn" onclick="clearTasks()">
            Clear
            <img class="clear_icon" id="icon-X" src="../assets/imgs/addTaskIcons/subtasksCancelIconAndClearTask.svg" alt="Icon" />
        </button>
        <button class="create_task_btn" id="create_task_btn" type="button" form="add_task_form" onclick="validateRequiredFields()">
            Create Task
            <img class="create_task_icon" id="create_task" src="../assets/imgs/addTaskIcons/creatTaskBtnCheck.svg" alt="Icon" />
        </button>
    `;
}

function showAddedNotificationTemplate(notificationText) {
    return `
        <p>${notificationText}</p>
        <img src="../assets/imgs/addTaskIcons/BoardMenuIcon.svg" alt="Icon" />
    `;
}

