function getLoginSignupTemplate() {
    return `
      <div class="login_card id="loginCard">
        <div>
          <h2>Log in</h2>
          <hr class="separator_horizontally">
        </div>
        <form id="loginForm" onsubmit="handleLogin(event)">
          <div class="input_login_container">
            <input id="loginEmail" class="mail_input_icon" type="text" placeholder="E-Mail">
            <input id="loginPassword" class="lock_input_icon" type="password" placeholder="Password">
          </div>
          <div class="button_login_container">
            <button class="dark_btn login_btn">Log in</button>
            <button class="light_btn guest_login_btn">Guest Log in</button>
          </div>
        </form>
      </div>

    <div class="signup_card d_none" id="signup_container">
      <button onclick="toggleLoginSignup()" class="left_arrow_icon"><img src="./assets/imgs/signupIcons/arrowLeftLine.svg" alt="arrow_left_icon"></button>
      <div>
        <a onclick="#"></a>
        
        <h2>Sign up</h2>
        <hr class="separator_horizontally">
      </div>
      <form id="signupForm" onsubmit="handleSignup(event)">
        <div class="input_login_container">
          <input id="signupName" class="name_input_icon" type="text" placeholder="Name">
          <input id="signupEmail" class="mail_input_icon" type="email" placeholder="E-Mail">
          <input id="signupPassword" class="lock_input_icon" type="password" placeholder="Password">
          <input id="signupConfirmPassword" class="lock_input_icon" type="password" placeholder="Confirm Password">
          <div class="checkbox_container">  
          <input type="checkbox" id="accept_policy" name="a" value="accept_policy">
          <label for="accept_policy">I accept the <a href="./policy/policy.html">Privacy policy</a></label>
          </div>
        </div>
      
        <div class="button_signup_container">
          <button class="dark_btn signup_btn">Sign up</button>
        </div>
      </form>
    </div>
  </div>
`
}

function getSidebarTemplate() {
    const currentPage = window.location.pathname;
    return `    
    <nav class="sidebar_nav">
      <a href="../summary/summary.html" class="${currentPage.includes('summary') ? 'active' : ''}">
        <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon">Summary
      </a>
      <a href="../addTask/addTask.html" class="${currentPage.includes('addTask') ? 'active' : ''}">
        <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon">Add Task
      </a>
      <a href="../board/board.html" class="${currentPage.includes('board') ? 'active' : ''}">
        <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon">Board
      </a>
      <a href="../contacts/contacts.html" class="${currentPage.includes('contacts') ? 'active' : ''}">
        <img src="../assets/imgs/sidebarIcons/contacts.svg" alt="Contacts Icon">Contacts
      </a>
    </nav>
    <div class="sidebar_footer">
      <a href="../policy/policy.html" class="${currentPage.includes('policy') ? 'active' : ''}">Privacy Policy</a>
      <a href="../legalNotes/legal.html" class="${currentPage.includes('legal') ? 'active' : ''}">Legal Notice</a>
    </div>
  `;
}



function getHeaderTemplate() {
  return `
    <header>
    <div class="join_logo_mobile"><a href="../index.html"><img src="../assets/imgs/joinHeaderMobileIcon.svg" alt="join_mobile_logo"></a></div>
      <span>Kanban Project Management Tool</span>
      <div class="user_menu">
        <a class="help_def" href="../help/help.html" class="help"><img src="../assets/imgs/summaryIcons/help.svg" alt="help_icon"></a>
        <button onclick="toggleUserMenu()" class="user_profile"></button>
        <div id="user_dropdown_menu" class="user_dropdown_menu d_none">
          <a class="help_mobile dropdown_header"  href="../help/help.html" class="help">Help</a>
          <a class="dropdown_header" href="../policy/policy.html">Privacy Policy</a>
          <a class="dropdown_header" href="../legalNotes/legal.html">Legal Notice</a>
          <a class="dropdown_header" href="#" onclick="logout(); return false;">Log out</a>
        </div>
      </div>
    </header>
  `;
}

function renderPlaceholder() {
  return `
  <span class="drag_area_placeholder">No Tasks</span>
  ` 
}

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
}

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
}

function getEditTaskTemplate(task) {
  return `
    
    <form id="edit_task_form" class="edit_task_form">  
      <div class="input_titel_group">
          <label for="title" class="required_for_label">Title</label>
          <input name="title" id="title" class="input_titel" type="text" placeholder="Enter a title" value="${task.title}"/>
      </div>
      
      <div class="textarea_group">
          <label id="description_label" for="description" class="required_for_label">Description</label>
          <textarea name="description" class="textarea" id="description" placeholder="Enter a Description">${task.description}</textarea>
      </div>

      <div class="input_date_group">
        <label for="due_date" class="required_for_label">Due date</label>
        <div class="input_date_container">
          <input onclick="openCalendar()" name="due_date" type="text" id="due_date" placeholder="dd/mm/yyyy" class="flatpickr_input input_date" value="${task.dueDate}"/>
          <img class="calendar_icon" src="../assets/imgs/boardIcons/CalenderIcon.svg" alt="Calendar Icon" onclick="openCalendar()"/>
        </div>
      </div>

      <div class="radio_btn_container">
        <span class="required_for_label">Priority</span>
        <div class="priority_btn_group">
          <input type="radio" id="priority_urgent" name="priority" value="urgent" ${task.priority === 'urgent' ? 'checked' : ''} onclick="switchBtnPriority('urgent')" />  
          <label for="priority_urgent" class="btn btn--red">
            Urgent
            <img src="../assets/imgs/boardIcons/priorityUrgent.svg" alt="Urgent Icon" class="priority_icon" id="icon_urgent"/>
          </label>

          <input type="radio" id="priority_medium" name="priority" value="medium" ${task.priority === 'medium' ? 'checked' : ''} onclick="switchBtnPriority('medium')"/>
          <label for="priority_medium" class="btn btn--orange">
            Medium
            <img src="../assets/imgs/boardIcons/priorityMedium.svg" alt="Medium Icon" class="priority_icon" id="icon_medium"/>
          </label>

          <input type="radio" id="priority_low" name="priority" value="low" ${task.priority === 'low' ? 'checked' : ''} onclick="switchBtnPriority('low')"/>
          <label for="priority_low" class="btn btn--green">
            Low
            <img src="../assets/imgs/boardIcons/priorityLow.svg" alt="Low Icon" class="priority_icon" id="icon_low"/>
          </label>
        </div>
      </div>

      <div class="assign_to_group">
        <label for="dropdown_toggle_btn" class="required_for_label">Assigned to</label>
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
        <label for="tag_input_field" class="required_for_label">Subtasks</label>
        <div class="tag_input">
          <input type="text" placeholder="Add new subtask" id="tag_input_field" onclick="replaceButtons()" onkeydown="onKeyDownEnter(event)"/>
          <div class="subtask_btn_container" id="subtask_btn_container">
            <button class="plus_btn" onclick="replaceButtons()">
              <img class="subtasks_icon arrow_bg_hover_color_subtask" src="../assets/imgs/boardIcons/subtasksPlusIcon.svg" alt="New Button Icon"/>
            </button>
          </div>
        </div>
        <div class="new_tag_container" id="new_tag_container"></div>
      </div>

      <div class="task_detail_buttons">
        <button type="button" class="dark_btn" onclick="saveEditTask('${task.id}')">
          Save
        </button>
      </div>
      
    </form>
  `;
}









