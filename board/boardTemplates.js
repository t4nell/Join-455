function renderPlaceholder() {
  return `
  <span class="drag_area_placeholder">No Tasks</span>
  ` 
};


function getTaskCard(task) {
  const progress = calculateSubtaskProgress(task);
  const categoryColor = getCategoryColor(task.category);
  return `
    <div draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${task.id}" class="task_card" onclick="renderDetailTemplate('${task.id}')">
      <div class="task_category">
        <span class="category_label" style="background-color: ${categoryColor}">${task.category}</span>
      </div>
      <div class="task_content">
          <h3 class="task_title">${task.title}</h3>
          <p class="task_description">${task.description}</p>
      </div>
      <div class="progress_section" style="${progress.total === 0 ? 'display:none' : ''}">
        <div class="progress_bar">
          <div class="progress_fill" style="width: ${progress.progressPercentage}%; background-color: ${progress.completed === progress.total ? 'var(--progress-fill-full-color)' : 'var(--progress-fill-color)'}"></div>
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
  `
};

function getAvatarTemplate(contact) {
    return `
            <div class="avatar" style="background-color: ${contact.color}">
                ${contact.initials}
            </div>
        `;
};


function renderMoreAvatarsButton(totalContacts, maxVisible) {
    return `
        <div class="avatar more-avatar">
            +${totalContacts - maxVisible}
        </div>
    `;
};


function getDetailTaskCard(task) {
  const categoryColor = getCategoryColor(task.category);
    return `
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
    `;
};


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


function getEditTaskTemplate(task) {
  return `
    
    <form id="edit_task_form" class="edit_task_form">  
      <div class="input_titel_group">
          <label for="title" class="required_for_label" onclick="event.preventDefault()">Title</label>
          <input name="title" id="title" class="input_titel" type="text" placeholder="Enter a title" value="${task.title}"/>
      </div>
      
      <div class="textarea_group">
          <label id="description_label" for="description" class="required_for_label" onclick="event.preventDefault()">Description</label>
          <textarea name="description" class="textarea" id="description" placeholder="Enter a Description">${task.description}</textarea>
      </div>

      <div class="input_date_group">
        <label for="due_date" class="required_for_label" onclick="event.preventDefault()">Due date</label>
        <div class="input_date_container">
          <input onclick="openCalendar()" name="due_date" type="text" id="due_date" placeholder="dd/mm/yyyy" class="flatpickr_input input_date" value="${task.dueDate}"/>
          <img class="calendar_icon" src="../assets/imgs/boardIcons/CalenderIcon.svg" alt="Calendar Icon" onclick="openCalendar()"/>
        </div>
      </div>

      <div class="radio_btn_container">
        <span class="required_for_label">Priority</span>
        <div class="priority_btn_group">
          <input type="radio" id="priority_urgent" name="priority" value="Urgent" ${task.priority === 'Urgent' ? 'checked' : ''} onclick="switchBtnPriority('Urgent')" />  
          <label for="priority_urgent" class="btn btn--red">
            Urgent
            <img src="../assets/imgs/boardIcons/priorityUrgent.svg" alt="Urgent Icon" class="priority_icon" id="icon_urgent"/>
          </label>

          <input type="radio" id="priority_medium" name="priority" value="Medium" ${task.priority === 'Medium' ? 'checked' : ''} onclick="switchBtnPriority('Medium')"/>
          <label for="priority_medium" class="btn btn--orange">
            Medium
            <img src="../assets/imgs/boardIcons/priorityMedium.svg" alt="Medium Icon" class="priority_icon" id="icon_medium"/>
          </label>

          <input type="radio" id="priority_low" name="priority" value="Low" ${task.priority === 'Low' ? 'checked' : ''} onclick="switchBtnPriority('Low')"/>
          <label for="priority_low" class="btn btn--green">
            Low
            <img src="../assets/imgs/boardIcons/priorityLow.svg" alt="Low Icon" class="priority_icon" id="icon_low"/>
          </label>
        </div>
      </div>

      <div class="assign_to_group">
        <label for="dropdown_toggle_btn" class="required_for_label" onclick="event.preventDefault()">Assigned to</label>
        <div class="dropdown" id="dropdown">
            <div class="dropdown_input_wrapper">
                <input onclick="toggleDropdownAssigned(event)" type="text" id="dropdown_toggle_btn" class="dropdown_toggle" placeholder="Select contacts to assign"/>
                <div class="arrow_bg_hover_color">
                    <span class="arrow"></span>
                </div>
            </div>
            <ul class="dropdown_menu" id="dropdown_menu"></ul>
        </div>
        <div id="selected_user_group" class="selected_user_group">${renderAssignedContactsEdit(task.assignedTo)}</div>
      </div>

      <div class="tag_input_container">
        <label for="tag_input_field" class="required_for_label" onclick="event.preventDefault()">Subtasks</label>
        <div class="tag_input">
          <input type="text" placeholder="Add new subtask" id="tag_input_field" onclick="replaceButtons()" onkeydown="onKeyDownEnter(event)"/>
          <div class="subtask_btn_container" id="subtask_btn_container">
            <button class="plus_btn" onclick="replaceButtons()">
              <img class="subtasks_icon arrow_bg_hover_color_subtask" src="../assets/imgs/boardIcons/subtasksPlusIcon.svg" alt="New Button Icon"/>
            </button>
          </div>
        </div>
        <div class="new_tag_container" id="new_tag_container">${renderEditableSubtasks(task)}</div>
      </div>

      <div class="task_detail_buttons">
        <button type="button" class="dark_btn" onclick="saveEditTask('${task.id}')">
          Save
        </button>
      </div>
      
    </form>
  `;
};


function createContactListItem(activeClass, contact, bgColor, nameInitials, surnameInitials, checkedAttr) {
    return `
    <li class="dropdown_item ${activeClass}" id="dropdown_item_${contact.id}" onclick="selectUser('${contact.id}', event)">
        <div class="symbole_name_group">
            <div class="avatar" style="background-color: ${bgColor}">
                <span>${nameInitials}${surnameInitials}</span>
            </div>
            <div>
                <span class="contact_name">${contact.name} ${contact.surname}</span>
            </div>
        </div>
        <input id="users_checkbox_${contact.id}"
        class="assign_dropdown_input"
        type="checkbox"
        name="assigned_to"
        value="${contact.name} ${contact.surname}" 
        ${checkedAttr}
        onclick="selectUser('${contact.id}', event)"/>
    </li>`;
};


function generateContactBadge(contactId, contact, initials) {
    return `
                <div id="selected_user_${contactId}" class="contact_badge">
                    <div class="avatar" style="background-color: ${contact.color}">
                        ${initials}
                    </div>
                </div>
            `;
};


function addSelectedUserIconTemplate(id, bgColor, initials) {
    return `
        <div id="selected_user_${id}">
            <div class="avatar" style="background-color: ${bgColor}">
                <div>${initials}</div>
            </div>
        </div>`;
};


function renderSubtaskElement(tagId, tagInputId, tagBtnConId, subtask) {
    return `
    <div class="tag_field" id='${tagId}'>
        <textarea 
            rows="1"
            name="subtasks" 
            class="new_tag_input" 
            id='${tagInputId}' 
            type="text"  
            ondblclick="enableEditing('${tagInputId}', '${tagBtnConId}', '${tagId}')" 
            onblur="disableEditing('${tagInputId}')" 
            oninput="autoResizeTextarea(this)"
            readonly>${subtask.title}</textarea>
        <div id='${tagBtnConId}' class="new_tag_btn_container">
            <div class="btns_position">
                <button class="edit_text_btn" onclick="editTextBtn(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                    <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon"/>
                </button>
                <hr class="separator_vertically_subtasks" />
                <button class="trash_btn" onclick="trashBtn('${tagId}')">
                    <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon"/>
                </button>
            </div>
        </div>
    </div>`;
};