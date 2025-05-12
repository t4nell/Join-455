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
            <button onclick="logout()" class="logout_btn">Log out</button>
          </div>
        </div>
      </header>
    `;
  }

  function renderPlaceholder() {
    return `
    <span class="drag_area_placeholder">No Task Todo</span>
    ` 
  }

  function getTaskCard() {
    return `
        <div id="task_card" class="task_card" onclick="renderDetailTemplate()">
        <div class="task_category">
            <span class="category_label">User Story</span>
        </div>
        <div class="task_content">
            <h3 class="task_title">Kochwelt Page & Recipe Recommender</h3>
            <p class="task_description">Build start page with recipe recommendation...</p>
        </div>
        <div class="progress_section">
            <div class="progress_bar">
                <div class="progress_fill"></div>
            </div>
            <span class="subtask_counter">1/2 Subtasks</span>
        </div>
        <div class="task_footer">
            <div class="assignee_avatars">
                <span class="avatar">AM</span>
                <span class="avatar">EM</span>
                <span class="avatar">MB</span>
            </div>
            <div class="menu_priority">
                <img src="../assets/imgs/boardIcons/priorityMedium.svg" alt="priority">
            </div>
        </div>
      </div>
    `
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
                    <div class="contact_side" id="${index}" onclick="handleContactClick(event, ${contactsArray.indexOf(contact)})">                        
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

  function getCurrenUserTemplate() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    
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
                            </div></div>`
  }

  function getCurrentUserDetailsTemplate() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserInitials = currentUser.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")

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
                <button onclick="editContactOverlay()" class="contact_btn">
                  <img src="../assets/imgs/contactIcons/edit.svg" alt="" /> Edit
                </button>
                <button class="contact_btn">
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
              <a href="">${currentUser.email}</a>
            </div>

            <div class="contact_phone">
              <span class="contact_category">Phone</span>
              <span>${currentUser.phone}</span>
            </div>
          </div>`
  }