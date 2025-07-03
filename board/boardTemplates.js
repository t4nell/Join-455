/**
 * Renders a placeholder element for empty task columns
 *
 * @returns {string} HTML string containing the placeholder markup with "No Tasks" text
 */
function renderPlaceholder() {
    return `
  <span class="drag_area_placeholder">No Tasks</span>
  `;
};


/**
 * Generates HTML markup for a task card with all its components
 *
 * @param {Object} task - The task object containing all task information
 * @param {string} task.id - Unique identifier of the task
 * @param {string} task.category - Category of the task
 * @param {string} task.title - Title of the task
 * @param {string} task.description - Description of the task
 * @param {Object} task.subtasks - Subtasks of the task
 * @param {Object} task.assignedTo - Users assigned to the task
 * @param {string} task.priority - Priority level of the task
 * @returns {string} HTML string representing the complete task card
 */
function getTaskCard(task, progress, categoryColor) {
    return `
    <div draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${
        task.id
    }" class="task_card" data-id="${task.id}" onclick="renderDetailTemplate('${task.id}')">
      <div class="task_card_header">
        <div class="task_category">
          <span class="category_label" style="background-color: ${categoryColor}">${task.category}</span>
        </div>
        <div id="section_button_container" style="display: none" >
          <button onclick="renderSwapStatusTemplate(event)" id="section_button" class="dark_btn_task_cart"><img class="dark_btn_task_cart_img" src="../assets/imgs/boardIcons/swapButton.svg" alt="Swap Button Icon"/></button>
        </div>
      </div>
      <div class="task_content">
          <h3 class="task_title">${task.title}</h3>
          <p class="task_description">${task.description}</p>
      </div>
      <div class="progress_section" style="${progress.total === 0 ? 'display:none' : ''}">
        <div class="progress_bar">
          <div class="progress_fill" style="width: ${progress.progressPercentage}%; background-color: ${
        progress.completed === progress.total ? 'var(--progress-fill-full-color)' : 'var(--progress-fill-color)'
    }"></div>
        </div>
        <span class="subtask_counter">${progress.completed}/${progress.total} Subtasks</span>
      </div>
      <div class="task_footer">
        <div class="assignee_avatars">
          ${renderAssignedAvatars(task.assignedTo)}
        </div>
        <div class="menu_priority">
          <img src="../assets/imgs/boardIcons/priority${task.priority}.svg" alt="${task.priority}">
        </div>
      </div>
    </div>
  `;
};


/**
 * Creates the mobile sidebar HTML
 *
 * @returns {string} HTML string for the mobile sidebar
 */
function getSidebarTemplateMobile(currentPage) {
    return ` 
    <div class="sidebar_container">  
        <nav class="sidebar_nav">
            <a href="../summary/summary.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon">
                <span>Summary</span>
            </a>
            <a href="../board/board.html" class="nav_item ${currentPage.includes('board') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon">
                <span>Board</span>
            </a>
            <a href="../addTask/addTask.html" class="nav_item ${currentPage.includes('addTask') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon">
                <span>Add Task</span>
            </a>
            <a href="../contacts/contacts.html" class="nav_item ${currentPage.includes('contacts') ? 'active' : ''}">
                <img src="../assets/imgs/sidebarIcons/contacts.svg" alt="Contacts Icon">
                <span>Contacts</span>
            </a>
        </nav>
    </div>
    `;
};


/**
 * Generates the HTML template for a task card
 *
 * @param {Object} task - The task object with all properties
 * @returns {string} HTML string for the task card
 */
function generateTaskCardHTML(task) {
    return `
        <div class="task_card" draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${task.id}">
            <div class="task_card_content">
                <h3 class="task_card_title">${task.title || 'No Title'}</h3>
                <p class="task_card_description">${task.description || 'No Description'}</p>
                <div class="task_card_footer">
                    <span class="task_card_due_date">${task.dueDate || ''}</span>
                    <span class="task_card_priority">${task.priority || ''}</span>
                </div>
            </div>
        </div>
    `;
};


/**
 * Generates HTML markup for a contact's avatar display
 *
 * @param {Object} contact - The contact object containing user information
 * @param {string} contact.color - Background color for the avatar
 * @param {string} contact.initials - User's initials to display in the avatar
 * @returns {string} HTML string containing the avatar markup with background color and initials
 */
function getAvatarTemplate(contact) {
    return `
          <div class="avatar" style="background-color: ${contact.color}">
              ${contact.initials}
          </div>
        `;
};


/**
 * Renders a batch showing the number of additional contacts not displayed
 *
 * @param {number} totalContacts - Total number of contacts assigned to the task
 * @param {number} maxVisible - Maximum number of contacts to display before showing the batch
 * @returns {string} HTML string containing the "more" button with count of additional contacts
 */
function renderMoreAvatarsButton(totalContacts, maxVisible) {
    return `
        <div class="avatar more_avatar">
            +${totalContacts - maxVisible}
        </div>
    `;
};


/**
 * Generates HTML markup for task status selection dropdown
 *
 * @param {Object} task - The task object containing status information
 * @param {string} task.status - Current status of the task ('toDo', 'inProgress', 'awaitingFeedback', 'done')
 * @returns {string} HTML string containing the status selection dropdown markup
 */
function getSwapStatusTemplate(task) {
    return `
    
    <div class="swap_status_template" id="swap_status_template" onclick="bubbling(event)">
    <div class="swap_status_header">
    <h3>Move To</h3>
    <div class="closed_btn_position">
    <button onclick="CloseSwapStatus()" class="closed_btn_swap_status">
            <img class="closed_btn_swap_status_img" src="../assets/imgs/boardIcons/close.svg" alt="close button">
          </button>
    </div>
    </div>
      <button id="status_button_todo" data-status="todo" class="swap_status_button" onclick="changeTaskStatus(event, '${task.id}', 'todo')">
        <img src="../assets/imgs/boardIcons/arrow_upward.svg" alt="Arrow Upward Icon">
        <p>To-Do</p>
      </button>
      <button id="status_button_in_Progress" data-status="inProgress" class="swap_status_button" onclick="changeTaskStatus(event, '${task.id}', 'inProgress')">
        <img id="status_button_in_Progress_img_arrow_upward" src="../assets/imgs/boardIcons/arrow_upward.svg" alt="Arrow Upward Icon">
        <img id="status_button_in_Progress_img_arrow_downward" src="../assets/imgs/boardIcons/arrow_downward.svg" alt="Arrow Downward Icon">
        <p>In progress</p>
      </button>
      <button id="status_button_await_Feedback" data-status="awaitFeedback" class="swap_status_button" onclick="changeTaskStatus(event, '${task.id}', 'awaitFeedback')">
        <img id="status_button_in_await_feedback_img_arrow_downward" src="../assets/imgs/boardIcons/arrow_downward.svg" alt="Arrow Downward Icon">
        <img id="status_button_in_await_feedback_img_arrow_upward" src="../assets/imgs/boardIcons/arrow_upward.svg" alt="Arrow Upward Icon">
        <p>Await feedback</p>
      </button>      
      <button id="status_button_done" data-status="done" class="swap_status_button" onclick="changeTaskStatus(event, '${task.id}', 'done')">
        <img  src="../assets/imgs/boardIcons/arrow_downward.svg" alt="Arrow Downward Icon">
        <p>Done</p>
      </button>
      <button id="status_button_done" data-status="done" class="swap_status_button_delete" onclick="deleteTask('${task.id}')">
        <img  class="swap_status_button_delete_img" src="../assets/imgs/boardIcons/delete.svg" alt="Arrow Downward Icon">
        <p>Delete</p>
      </button>
    </div>
  `;
};


/**
 * Generates HTML markup for the detailed task card view
 *
 * @param {Object} task - The task object containing all task details
 * @param {string} task.category - Category of the task
 * @param {string} task.title - Title of the task
 * @param {string} task.description - Description of the task
 * @param {string} task.date - Due date of the task
 * @param {string} task.priority - Priority level of the task
 * @param {Array} task.assignedTo - Array of assigned contacts
 * @param {Array} task.subtasks - Array of subtask objects
 * @returns {string} HTML string containing the detailed task card markup
 */
function getDetailTaskCard(task, categoryColor) {
    return `
      <div class="task_detail_card_template">
        <div class="task_detail_card_header">
          <span class="category_lable_detail" style="background-color: ${categoryColor}">${task.category}</span>
          <button onclick="closeDetailTemplate()" class="closed_btn">
            <img src="../assets/imgs/boardIcons/close.svg" alt="close button">
          </button>
        </div>

        <div class="task_detail_title">
          <h2>${task.title}</h2>
        </div>

        <div class="task_detail_description">
          <p>${task.description}</p>
        </div>

        <div class="task_detail_date">
          <span class="detail_label">Due Date:</span>
          <span>${task.dueDate}</span>
        </div>

        <div class="task_detail_priority">
          <span class="detail_label">Priority:</span>
          <div class="priority_badge">
            ${task.priority}
            <img src="../assets/imgs/boardIcons/priority${task.priority}.svg" alt="${task.priority}">
          </div>
        </div>

        <div class="task_detail_assigned">
          <span class="detail_label">Assigned to:</span>
          <div class="assigned_contacts">
            ${renderAssignedContacts(task.assignedTo)}
          </div>
        </div>

        <div class="task_detail_subtasks">
          <span class="detail_label">Subtasks:</span>
          <div class="subtasks_list">
            ${renderSubtasksList(task.subtasks, task.id)}
          </div>
        </div>

        <div class="task_detail_buttons">
          <button class="delete_btn" onclick="deleteTask('${task.id}')">
            <img src="../assets/imgs/boardIcons/delete.svg" alt="delete">
            Delete
          </button>
          <button class="edit_btn" onclick="openEditTask('${task.id}')">
            <img src="../assets/imgs/boardIcons/edit.svg" alt="edit">
            Edit
          </button>
          </div>
      </div>    
    `;
};


/**
 * Generates HTML markup for displaying assigned contacts in task detail view
 *
 * @param {string} contactId - Unique identifier of the contact
 * @param {Object} contact - Contact object containing user information
 * @param {string} contact.name - Full name of the contact
 * @param {string} contact.color - Background color for contact avatar
 * @param {string} initials - Contact's initials for avatar display
 * @returns {string} HTML string containing the assigned contact markup
 */
function getAssignedContactsTemplate(contactId, contact, initials) {
    return `
      <div class="contact_badge" data-contact-id="${contactId}">
        <div class="avatar" style="background-color: ${contact.color}">
          ${initials}
        </div>
        <span>${contact.name} ${contact.surname}</span>
      </div>
    `;
};


/**
 * Generates HTML markup for a subtask item in task detail view
 *
 * @param {number} key - Index or unique identifier of the subtask
 * @param {Object} subtask - Subtask object containing subtask information
 * @param {string} subtask.title - Title of the subtask
 * @param {boolean} subtask.done - Completion status of the subtask
 * @param {string} taskId - ID of the parent task
 * @returns {string} HTML string containing the subtask item markup with checkbox
 */
function getSubtaskTemplate(key, subtask, taskId) {
    return `
      <div class="subtask_item">
          <div class="subtask_background">
              <input type="checkbox" class= "subtask_chbox"
                      id="subtask_${key}" 
                      ${subtask.done ? 'checked' : ''} 
                      onchange="toggleSubtaskStatus('${taskId}', '${key}', this)">
              <label for="subtask_${key}">${subtask.title}</label>
          </div>
      </div>
    `;
};


/**
 * Generates HTML markup for the task edit form
 *
 * @param {Object} task - The task object containing current task data
 * @param {string} task.title - Current title of the task
 * @param {string} task.description - Current description of the task
 * @param {string} task.date - Due date of the task
 * @param {string} task.category - Current category of the task
 * @param {string} task.priority - Current priority level
 * @param {Array} task.assignedTo - Array of currently assigned contacts
 * @param {Array} task.subtasks - Array of current subtask objects
 * @returns {string} HTML string containing the complete edit form markup
 */
function getEditTaskTemplate(task) {
    return ` 
    <button onclick="closeDetailTemplate()" class="closed_btn edit_close_btn">
            <img src="../assets/imgs/boardIcons/close.svg" alt="close button">
          </button>
    <form id="edit_task_form" class="edit_task_form" onclick="handleClickOutsideEditTask(event)">  
      <div class="input_titel_group">
          <label for="title_edit_task" class="required_for_label" onclick="event.preventDefault()">Title</label>
          <input name="title" id="title_edit_task" class="input_titel" type="text" placeholder="Enter a title" value="${
              task.title
          }"/>
      </div>
      
      <div class="textarea_group">
          <label id="description_label_edit_task" for="description_edit_task" class="required_for_label" onclick="event.preventDefault()">Description</label>
          <textarea name="description" class="textarea" id="description_edit_task" placeholder="Enter a Description">${
              task.description
          }</textarea>
      </div>

      <div class="input_date_group">
        <label for="due_date_edit_task" class="required_for_label" onclick="event.preventDefault()">Due date</label>
        <div class="input_date_container">
          <input onclick="openCalendarEditTask()" name="due_date" type="text" id="due_date_edit_task" placeholder="dd/mm/yyyy" class="flatpickr_input input_date" value="${
              task.dueDate
          }"/>
          <img class="calendar_icon" src="../assets/imgs/boardIcons/CalenderIcon.svg" alt="Calendar Icon" onclick="openCalendarEditTask()"/>
        </div>
      </div>

      <div class="radio_btn_container">
        <span class="required_for_label">Priority</span>
        <div class="priority_btn_group">
          <input type="radio" id="priority_urgent_edit_task" name="priority" value="Urgent" ${
              task.priority === 'Urgent' ? 'checked' : ''
          } onclick="switchBtnPriorityEditTask('Urgent')" />  
          <label for="priority_urgent_edit_task" class="btn btn--red">
            Urgent
            <img src="../assets/imgs/boardIcons/priorityUrgent.svg" alt="Urgent Icon" class="priority_icon" id="icon_urgent_edit_task"/>
          </label>

          <input type="radio" id="priority_medium_edit_task" name="priority" value="Medium" ${
              task.priority === 'Medium' ? 'checked' : ''
          } onclick="switchBtnPriorityEditTask('Medium')"/>
          <label for="priority_medium_edit_task" class="btn btn--orange">
            Medium
            <img src="../assets/imgs/boardIcons/priorityMedium.svg" alt="Medium Icon" class="priority_icon" id="icon_medium_edit_task"/>
          </label>

          <input type="radio" id="priority_low_edit_task" name="priority" value="Low" ${
              task.priority === 'Low' ? 'checked' : ''
          } onclick="switchBtnPriorityEditTask('Low')"/>
          <label for="priority_low_edit_task" class="btn btn--green">
            Low
            <img src="../assets/imgs/boardIcons/priorityLow.svg" alt="Low Icon" class="priority_icon" id="icon_low_edit_task"/>
          </label>
        </div>
      </div>

      <div class="assign_to_group">
        <label for="dropdown_toggle_btn_edit_task" class="required_for_label" onclick="event.preventDefault()">Assigned to</label>
        <div class="dropdown" id="dropdown_edit_task">
            <div class="dropdown_input_wrapper">
                <input onclick="toggleDropdownAssignedEditTask(event)" type="text" id="dropdown_toggle_btn_edit_task" class="dropdown_toggle" placeholder="Select contacts to assign"/>
                <div class="arrow_bg_hover_color">
                    <span class="arrow"></span>
                </div>
            </div>
            <ul class="dropdown_menu" id="dropdown_menu_edit_task"></ul>
        </div>
        <div id="selected_user_group_edit_task" class="selected_user_group">${renderAssignedContactsEditTask(
            task.assignedTo
        )}</div>
      </div>

      <div class="tag_input_container">
        <label for="tag_input_field_edit_task" class="required_for_label" onclick="event.preventDefault()">Subtasks</label>
        <div class="tag_input">
          <input type="text" placeholder="Add new subtask" id="tag_input_field_edit_task" onclick="replaceButtonsEditTask()" onkeydown="onKeyDownEnterEditTask(event)"/>
          <div class="subtask_btn_container" id="subtask_btn_container_edit_task">
            <button class="plus_btn" onclick="replaceButtonsEditTask()">
              <img class="subtasks_icon arrow_bg_hover_color_subtask" src="../assets/imgs/boardIcons/subtasksPlusIcon.svg" alt="New Button Icon"/>
            </button>
          </div>
        </div>
        <div class="new_tag_container" id="new_tag_container_edit_task">${renderEditableSubtasks(task)}</div>
      </div>

      <div class="task_detail_buttons">
        <button type="button" class="dark_btn" onclick="saveEditTask('${task.id}')">
          Save
        </button>
      </div>
      
    </form>
  `;
};


/**
 * Creates HTML markup for a contact list item in the assign contacts dropdown
 *
 * @param {string} activeClass - CSS class to indicate if contact is selected
 * @param {Object} contact - Contact object containing user information
 * @param {string} bgColor - Background color for contact avatar
 * @param {string} nameInitials - First letter of contact's first name
 * @param {string} surnameInitials - First letter of contact's last name
 * @param {string} checkedAttr - HTML checked attribute for the checkbox ('checked' or '')
 * @returns {string} HTML string containing the contact list item markup
 */
function createContactListItem(activeClass, contact, bgColor, nameInitials, surnameInitials, checkedAttr) {
    return `
    <li class="dropdown_item ${activeClass}" id="dropdown_item_${contact.id}" onclick="selectUserEditTask('${contact.id}', event)">
        <div class="symbole_name_group">
            <div class="avatar" style="background-color: ${bgColor}">
                <span>${nameInitials}${surnameInitials}</span>
            </div>
            <div>
                <span class="contact_name">${contact.name} ${contact.surname}</span>
            </div>
        </div>
        <input id="users_checkbox_${contact.id}_edit_task"
        class="assign_dropdown_input"
        type="checkbox"
        name="assigned_to"
        value="${contact.name} ${contact.surname}" 
        ${checkedAttr}
        onclick="selectUserEditTask('${contact.id}', event)"/>
    </li>`;
};


/**
 * Creates HTML markup for a contact list item in the assign contacts dropdown
 *
 * @param {string} activeClass - CSS class to indicate if contact is selected
 * @param {Object} contact - Contact object containing user information
 * @param {string} bgColor - Background color for contact avatar
 * @param {string} nameInitials - First letter of contact's first name
 * @param {string} surnameInitials - First letter of contact's last name
 * @param {string} checkedAttr - HTML checked attribute for the checkbox ('checked' or '')
 * @returns {string} HTML string containing the contact list item markup
 */
function generateContactBadge(contactId, contact, initials) {
    return `
        <div id="selected_user_${contactId}" class="contact_badge">
            <div class="avatar" style="background-color: ${contact.color}">
                ${initials}
            </div>
        </div>
    `;
};


/**
 * Generates HTML markup for selected user icon in the assign contacts section
 *
 * @param {string} id - Unique identifier of the contact
 * @param {string} bgColor - Background color for contact avatar
 * @param {string} initials - Contact's initials for avatar display
 * @returns {string} HTML string containing the selected user icon markup
 */
function addSelectedUserIconTemplate(id, bgColor, initials) {
    return `
        <div id="selected_user_${id}">
            <div class="avatar" style="background-color: ${bgColor}">
                <div>${initials}</div>
            </div>
        </div>`;
};


/**
 * Generates HTML markup for a subtask input element with controls
 *
 * @param {string} tagId - ID for the subtask container element
 * @param {string} tagInputId - ID for the subtask input field
 * @param {string} tagBtnConId - ID for the button container
 * @param {Object} subtask - Subtask object containing title and status
 * @param {string} subtask.title - Title of the subtask
 * @param {boolean} subtask.done - Completion status of the subtask
 * @returns {string} HTML string containing the subtask input element markup
 */
function renderSubtaskElement(tagId, tagInputId, tagBtnConId, subtask) {
    return `
    <div class="tag_field" id='${tagId}'>
        <textarea 
            rows="1"
            name="subtasks" 
            class="new_tag_input" 
            id='${tagInputId}' 
            type="text"  
            ondblclick="enableEditingEditTask('${tagInputId}', '${tagBtnConId}', '${tagId}')" 
            onblur="disableEditingEditTask('${tagInputId}')" 
            oninput="autoResizeTextareaEditTask(this)"
            readonly>${subtask.title}</textarea>
        <div id='${tagBtnConId}' class="new_tag_btn_container">
            <div class="btns_position">
                <button class="edit_text_btn" onclick="editTextBtnEditTask(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                    <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon"/>
                </button>
                <hr class="separator_vertically_subtasks" />
                <button class="trash_btn" onclick="trashBtnEditTask('${tagId}')">
                    <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon"/>
                </button>
            </div>
        </div>
    </div>`;
};