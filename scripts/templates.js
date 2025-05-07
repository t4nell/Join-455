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

function getsummaryTemplate() {
    return `
Hallo, this is the summary template.
     `
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