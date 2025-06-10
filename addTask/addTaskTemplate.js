function getSidebarTemplateMobile(currentPage) {
    return ` 
    <div class="sidebar_container">
            <nav class="sidebar_nav">
                <a href="../summary/summary.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon" />
                    <span>Summary</span>
                </a>
                <a href="../board/board.html" class="nav_item ${currentPage.includes('board') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon" />
                    <span>Board</span>
                </a>
                <a href="../addTask/addTask.html" class="nav_item ${currentPage.includes('addTask') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon" />
                    <span>Add Task</span>
                </a>

                <a
                    href="../contacts/contacts.html"
                    class="nav_item ${currentPage.includes('contacts') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/contacts.svg" alt="Contacts Icon" />
                    <span>Contacts</span>
                </a>
            </nav>
        </div>
`;
}

function showAddedNotificationTemplate(notificationText) {
    return `
        <p>${notificationText}</p>
        <img src="../assets/imgs/addTaskIcons/BoardMenuIcon.svg" alt="Icon" />
    `;
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
                            <label
                                id="description_label"
                                for="description"
                                class="input-title"
                                onclick="event.preventDefault()"
                                >Description</label
                            >
                            <textarea
                                name="description"
                                class="textarea"
                                id="description"
                                placeholder="Enter a Description"></textarea>
                        </div>
                        <div class="input_date_group">
                            <label for="due_date" class="required_for_label" onclick="event.preventDefault()"
                                >Due date</label
                            >
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
                                <input
                                    type="radio"
                                    id="prio_urgent"
                                    name="priority"
                                    value="Urgent"
                                    onclick="switchBtnPriority('urgent')" />
                                <label for="prio_urgent" class="btn btn--red"
                                    >Urgent
                                    <img
                                        src="../assets/imgs/addTaskIcons/priorityUrgentIcon.svg"
                                        alt="Urgent Icon"
                                        class="priority_icon"
                                        id="icon_urgent"
                                /></label>
                                <input
                                    type="radio"
                                    id="prio_medium"
                                    name="priority"
                                    value="Medium"
                                    checked
                                    onclick="switchBtnPriority('medium')" />
                                <label for="prio_medium" class="btn btn--orange"
                                    >Medium
                                    <img
                                        src="../assets/imgs/addTaskIcons/priorityMediumIconWhite.svg"
                                        alt="Medium Icon"
                                        class="priority_icon"
                                        id="icon_medium"
                                /></label>
                                <input
                                    type="radio"
                                    id="prio_low"
                                    name="priority"
                                    value="Low"
                                    onclick="switchBtnPriority('low')" />
                                <label for="prio_low" class="btn btn--green"
                                    >Low
                                    <img
                                        src="../assets/imgs/addTaskIcons/priorityLowIcon.svg"
                                        alt="Low Icon"
                                        class="priority_icon"
                                        id="icon_low"
                                /></label>
                            </div>
                        </div>
                        <div class="assign_to_group">
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
                        </div>
                        <div id="selected_users_group" class="selected_user_group"></div>
                        <div class="category_group">
                            <label
                                class="required_for_label"
                                for="category_dropdown_input"
                                onclick="event.preventDefault()"
                                >Category</label
                            >
                            <div class="category_dropdown" id="category_dropdown">
                                <div class="category_dropdown_input_wrapper">
                                    <input
                                        name="category"
                                        type="text"
                                        id="category_dropdown_input"
                                        name="category"
                                        class="category_dropdown_toggle"
                                        placeholder="Select task category"
                                        readonly
                                        required
                                        onclick="toggleDropdownCategory(event); closeCategoryDropdown(event)" />
                                    <span class="category_arrow_bg_hover_color">
                                        <span class="arrow"></span>
                                    </span>
                                </div>
                                <span id="required_message_category" class="required_message"
                                    >This field is required</span
                                >
                                <ul class="category_dropdown_menu" id="category_dropdown_menu"></ul>
                            </div>
                        </div>
                        <div class="tag_input_container">
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
                        </div>
                    </section>
                    <div class="required_footer_text_mobile_container">
                        <p class="required_footer_text_mobile show_mobile_required_text_footer">
                            * These fields are required
                        </p>
                    </div>
                </form>
                <footer class="create_task">
                    <div>
                        <p class="required_footer_text hide_mobile_required_text_footer">* These fields are required</p>
                    </div>
                    <div class="btn_position">
                        <button
                            class="clear_btn"
                            type="reset"
                            form="add_task_form"
                            id="clear_btn"
                            onclick="clearTasks()">
                            Clear
                            <img
                                class="clear_icon"
                                id="icon-X"
                                src="../assets/imgs/addTaskIcons/subtasksCancelIconAndClearTask.svg"
                                alt="Icon" />
                        </button>
                        <button
                            class="create_task_btn"
                            id="create_task_btn"
                            type="button"
                            form="add_task_form"
                            onclick="validateRequiredFields()">
                            Create Task
                            <img
                                class="create_task_icon"
                                id="create_task"
                                src="../assets/imgs/addTaskIcons/creatTaskBtnCheck.svg"
                                alt="Icon" />
                        </button>
                    </div>
                </footer>
                <div class="navbar_mobile_container_style" id="navbar_mobile_container"></div>
            </div>
            <div
                onclick="eventBubbling(event)"
                id="contact_added_task_notification"
                class="contact_save_message_addTask center_flex closed"></div>

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

