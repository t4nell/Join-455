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

function getContactListTemplate() {
  return `<div class="contact_small_img">
            <img src="../assets/imgs/contactIcons/profile_badge.svg" alt="" />
          </div>
          <div class="contact_side_info">
            <div class="contact_side_name">
              <span>Anton Mayer</span>
            </div>
            <div class="contact_side_mail">
              <span>antom@gmail.com</span>
            </div>
          </div>`
}

function getHeaderTemplate() {
  return `
    <header>
      <span>Kanban Project Management Tool</span>
      <div class="user_menu">
        <a href="../help/help.html" class="help"><img src="../assets/imgs/summaryIcons/help.svg" alt="help_icon"></a>
        <button onclick="toggleUserMenu()" class="user_profile"></button>
        <div id="user_dropdown_menu" class="user_dropdown_menu d_none">
          <a href="../policy/policy.html">Privacy Policy</a>
          <a href="../legalNotes/legal.html">Legal Notice</a>
          <a href="#" onclick="logout(); return false;">Log out</a>
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
  return `
    <div draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${task.id}" class="task_card" onclick="renderDetailTemplate('${task.id}')">
      <div class="task_category">
          <span class="category_label">${task.category}</span>
      </div>
      <div class="task_content">
          <h3 class="task_title">${task.title}</h3>
          <p class="task_description">${task.description}</p>
      </div>
      <div class="progress_section">
                <div class="progress_bar">
                    <div class="progress_fill" style="width: ${progress.progressPercentage}%"></div>
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
    return `
        <div class="task_detail_card_header">
            <span class="category_lable_detail">${task.category}</span>
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
            <button class="delete_btn">
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
    
      <div class="main_section_left">
        <div class="input_titel_group">
            <label for="title" class="required_for_label">Title</label>
            <input name="title" id="title" class="input_titel" type="text" placeholder="Enter a title" value="${task.title}"/>
        </div>
      </div>

      <div class="textarea_group">
          <label id="description_label" for="description" class="input-title">Description</label>
          <textarea name="description" class="textarea" id="description" placeholder="Enter a Description">${task.description}</textarea>
      </div>

      <div class="input_date_group">
        <label for="due_date" class="required_for_label">Due date</label>
        <div class="input_date_container">
          <input name="due_date" type="text" id="due_date" placeholder="dd/mm/yyyy" class="flatpickr_input input_date" value="${task.dueDate}"/>
          <img class="calendar_icon" src="../assets/imgs/boardIcons/CalenderIcon.svg" alt="Calendar Icon" onclick="openCalendar()"/>
        </div>
      </div>

      <div class="radio_btn_container">
      <span>Priority</span>
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

      <div class="assign_to_group">
                <label for="dropdown_toggle_btn">Assigned to</label>
                <div class="dropdown" id="dropdown">
                    <div class="dropdown_input_wrapper">
                        <input onclick="toggleDropdownAssigned(event)" type="text" id="dropdown_toggle_btn" class="dropdown_toggle" placeholder="Select contacts to assign"/>
                        <div class="arrow_bg_hover_color">
                            <span class="arrow"></span>
                        </div>
                    </div>
                    <ul class="dropdown_menu" id="dropdown_menu"></ul>
                </div>
            </div>
            <div id="selected_users_group" class="selected_user_group"></div>

      <div class="tag_input_container">
        <label for="tag_input_field">Subtasks</label>
        <div class="tag_input">
          <input type="text" placeholder="Add new subtask" id="tag_input_field" onclick="replaceButtons()" onkeydown="onKeyDownEnter(event)"/>
          <div class="subtask_btn_container" id="subtask_btn_container">
            <button class="plus_btn" onclick="replaceButtons()">
              <img class="subtasks_icon arrow_bg_hover_color_subtask" src="../assets/imgs/boardIcons/subtasksPlusIcon.svg" alt="New Button Icon"/>
            </button>
          </div>
        </div>
        <div class="new_tag_container" id="new_tag_container">
          
        </div>
      </div>

      <div class="task_detail_buttons">
        <button type="button" class="dark_btn">
          Save
        </button>
      </div>
    
  `;
}

function getContactListTemplate(letter, groupedContacts) {
  return `
      <div class="letter_group" id="letter_group_${letter}">
          <div class="letter_index" id="letter_index_container_${letter}">
              ${letter}
          </div>
          <div class="letter_separator_horizontal">
              <hr class="separator_horizontal" />
          </div>
          <div class="contacts_container" >
              ${groupedContacts[letter].map((contact, index) => `
                  <div class="contact_side" data-email="${contact.email}" id="${index}" onclick="handleContactClick(event, ${contactsArray.indexOf(contact)})">                        
                  <div class="profile_icon_mini" style="background-color: ${contact.color}">
                          <span>${contact.name.charAt(0).toUpperCase()}${contact.surname.charAt(0).toUpperCase() ? `${contact.surname.charAt(0).toUpperCase()}` : ""}</span>
                      </div>
                      <div class="contact_side_info">
                          <div class="contact_side_name">
                              <span>${contact.name} ${contact.surname}</span>
                          </div>
                          <div class="contact_side_mail">
                              <span>${contact.email}</span>
                          </div>
                      </div>
                  </div>
              `).join('')}
          </div>
      </div>`
}

function getCurrentUserTemplate(currentUser, currentUserInitials) {
  
  return `<div class="letter_index"">
                              User
                              </div>
                              <div class="letter_separator_horizontal">
                                  <hr class="separator_horizontal" />
                              </div>
                          <div class="contact_side" id="current_user" onclick="showCurrentUserDetails()">
                              <div class="profile_icon_mini">
                                  <span>${currentUserInitials}</span>
                              </div>
                              <div class="contact_side_info">
                                  <div class="contact_side_name">
                                      <span>${currentUser.name} ${currentUser.surname ? `${currentUser.surname}` : ''} (You)</span>
                                  </div>
                                  <div class="contact_side_mail">
                                      <span>${currentUser.email}</span>
                                  </div>
                              </div>
                          </div></div>
                          <div id="all_contacts_container"></div>`
}

function getCurrentUserDetailsTemplate(currentUser, currentUserInitials) {
  return `
<div class="contact_header">
          <div class="profile_icon_large" style="background-color: ${currentUser.color}">
                          <span>${currentUserInitials}</span>
                      </div>

          <div class="contact_head">
            <div class="contact_name">
              <span>${currentUser.name}</span>
            </div>

            <div class="contact_buttons">
              <button onclick="editCurrentUserOverlay()" class="contact_btn">
                <img src="../assets/imgs/contactIcons/edit.svg" alt="" /> Edit
              </button>

            </div>
          </div>
        </div>

        <div class="contact_information_text">
          <span>Contact Information</span>
        </div>

        <div class="contact_details">
          <div class="contact_mail">
            <span class="contact_category">Email</span>
            <a href="">${currentUser.email}</a>
          </div>

            <div class="contact_phone">
              <span class="contact_category">Phone</span>
              <span>+49</span>
            </div>
          </div>`
  }

  function getContactDetailsTemplate(contact){
    return`
                <div class="contact_header">
            <div class="profile_icon_large" style="background-color: ${contact.color}">
                            <span>${contact.name.charAt(0).toUpperCase()}${contact.surname.charAt(0).toUpperCase() ? `${contact.surname.charAt(0).toUpperCase()}` : ""}</span>
                        </div>

            <div class="contact_head">
              <div class="contact_name">
                <span>${contact.name} ${contact.surname}</span>
              </div>

              <div class="contact_buttons">
                <button onclick="editContactOverlay(${contactsArray.indexOf(contact)} )" class="contact_btn">
                  <img src="../assets/imgs/contactIcons/edit.svg" alt="" /> Edit
                </button>
                <button onclick="deleteContact('${contact.id}')" class="contact_btn">
                  <img src="../assets/imgs/contactIcons/delete.svg" alt="" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="contact_information_text">
            <span>Contact Information</span>
          </div>

          <div class="contact_details">
            <div class="contact_mail">
              <span class="contact_category">Email</span>
              <a href="">${contact.email}</a>
            </div>

            <div class="contact_phone">
              <span class="contact_category">Phone</span>
              <span>${contact.phone}</span>
            </div>
          </div>
        </div>`
  }

function getNewContactOverlay(){
  return `          <div class="overlay_side_img">
            <img src="../assets/imgs/contactIcons/Capa_1.svg" alt="Join Logo" />
            <div class="overlay_text_container">
              <span class="overlay_text_left">Add Contact</span>
              <span class="overlay_phrase_left pb_20"
                >Tasks are better with a Team!</span
              >
              <hr class="overlay_separator_horizontal" />
            </div>
          </div>
          <div>
            <div class="contact_overlay_img">
              <img
                src="../assets/imgs/contactIcons/defaultProfileImg.svg"
                alt=""
              />
            </div>

            <form id="new_contact_form" >
            <div class="contact_input_fields">
              <input
                class="overlay_input name_input_icon"
                id="new_contact_name"
                name="new_contact_name"
                type="text"
                placeholder="Name"
                required
              />
              <p class="alert d_none" id="name_alert">*Please enter first-and surname.</p>
              <input
                class="overlay_input mail_input_icon"
                id="new_contact_email"
                name="new_contact_email"
                type="email"
                placeholder="Email"
                required
              />
              <p class="alert d_none" id="mail_alert">*Please enter a valid email address.</p>
              <input
                class="overlay_input phone_input_icon"
                id="new_contact_phone"
                name="new_contact_phone"
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="Phone"
                required
              />
              <p class="alert d_none" id="phone_alert">*Please enter a valid phone number.</p>
            </div>
            <div class="overlay_buttons">
              <button onclick="toggleOverlay()" class="cancel_btn">
                Cancel
                <img
                  src="../assets/imgs/contactIcons/iconoir_cancel.svg"
                  alt="cancel button"
                />
              </button>
              <button onclick="createNewContact(event)" type="submit" form="add_contact_form" class="create_contact_btn">
                Create Contact
                <img
                  src="../assets/imgs/contactIcons/check.svg"
                  alt="create contact button"
                />
              </button>
              </form>
            </div>`
}

function getEditContactOverlay(contact, index){
  return `                     <div class="overlay_side_img">
            <img src="../assets/imgs/contactIcons/Capa_1.svg" alt="Join Logo" />
            <div class="overlay_text_container">
              <span class="overlay_text_left pb_20">Edit Contact</span>
              <hr class="overlay_separator_horizontal" />
            </div>
          </div>
          <div>
                <div class="contact_header">
            <div class="profile_icon_large contact_overlay_img" style="background-color: ${contact.color}">
                            <span>${contact.name.charAt(0).toUpperCase()}${contact.surname.charAt(0).toUpperCase() ? `${contact.surname.charAt(0).toUpperCase()}` : ""}</span>
                        </div>

            <form id="edit_contact_form" data-index="${index}" onsubmit="saveEditContact(event)">
            <div class="contact_input_fields">
              <input
                class="overlay_input name_input_icon"
                type="text"
                placeholder="Name"
                id="edit_name"
                name="edit_contact_name"
                required
              />
              <p class="alert d_none" id="edit_name_alert">*Please enter first-and surname.</p>
              <input
                class="overlay_input mail_input_icon"
                type="text"
                placeholder="Email"
                id="edit_mail"
                name="edit_contact_mail"
                required
              />
              <p class="alert d_none" id="edit_mail_alert">*Please enter a valid email address.</p>
              <input
                class="overlay_input phone_input_icon"
                type="text"
                placeholder="Phone"
                id="edit_phone"
                name="edit_contact_phone"
                required
              />
              <p class="alert d_none" id="edit_phone_alert">*Please enter a valid phone number.</p>
            </div>
            <div class="overlay_edit_buttons">
              <button class="delete_contact_btn">Delete</button>
              <button  type="submit" form="edit_contact_form" class="save_contact_btn">
                Save
                <img
                  src="../assets/imgs/contactIcons/check.svg"
                  alt="create contact button"
                />
              </button>
            </div>
            </form>

          </div>`
}
function getCurrentUserEditOverlay(currentUserInitials){
  return `                     <div class="overlay_side_img">
            <img src="../assets/imgs/contactIcons/Capa_1.svg" alt="Join Logo" />
            <div class="overlay_text_container">
              <span class="overlay_text_left pb_20">Edit Contact</span>
              <hr class="overlay_separator_horizontal" />
            </div>
          </div>
          <div>
                <div class="contact_header">
            <div class="profile_icon_large contact_overlay_img" >
                            <span>${currentUserInitials}</span>
                        </div>

            <div class="contact_input_fields">
              <input
                class="overlay_input name_input_icon"
                type="text"
                placeholder="Name"
                id="edit_name"
                name="edit_contact_name"
                value=""
                required
              />
              <p class="alert d_none" id="edit_name_alert">*Please enter first-and surname.</p>
              <input
                class="overlay_input mail_input_icon"
                type="text"
                placeholder="Email"
                id="edit_mail"
                name="edit_contact_mail"
                required
              />
              <p class="alert d_none" id="edit_mail_alert">*Please enter a valid email address.</p>
              <input
                class="overlay_input phone_input_icon"
                type="text"
                placeholder="Phone"
                id="edit_phone"
                name="edit_contact_phone"
                required
              />
              <p class="alert d_none" id="edit_phone_alert">*Please enter a valid phone number.</p>
            </div>
            <div class="overlay_edit_buttons">
              <button class="delete_contact_btn">Delete</button>
              <button onclick="saveCurrentUserInfo()" class="save_contact_btn">
                Save
                <img
                  src="../assets/imgs/contactIcons/check.svg"
                  alt="create contact button"
                />
              </button>
            </div>
          </div>`
}