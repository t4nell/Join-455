function getLoginTemplate() {
    return `
      <div class="login_card">
          <div>
          <h2>Log in</h2>
          <hr class="separator_horizontally">
          </div>
        <form action="login" method="post">
          <div class="input_login_container">
            <input class="mail_input_icon" type="text" placeholder="E-Mail">
            <input class="lock_input_icon" type="password" placeholder="Password">
          </div>
          <div class="button_login_container">
            <button class="dark_btn login_btn">Log in</button>
            <button class="light_btn guest_login_btn">Guest Log in</button>
          </div>
        </form>
      </div>
    `
}

function getSignupTemplate() {
    return `<div class="signup_card">
        <div>
        <a onclick="#"></a>
        
        <h2>Sign up</h2>
        <hr class="separator_horizontally">
      </div>
      <form action="login" method="post">
        <div class="input_login_container">
          <input class="name_input_icon" type="text" placeholder="Name">
          <input class="mail_input_icon" type="email" placeholder="E-Mail">
          <input class="lock_input_icon" type="password" placeholder="Password">
          <input class="lock_input_icon" type="password" placeholder="Confirm Password">
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
  `
}

function getSidebarTemplate() {
  const currentPage = window.location.pathname;
  return `    
    <div class="sidebar_container">
      <div>
        <a href="../index.html"><img src="../assets/imgs/join_logo_light.svg" alt="Join Logo"></a>
      </div>
      <nav class="sidebar_nav">
        <a href="../summary/summary.html" class="${currentPage.includes('summary') ? 'active' : ''}">
          <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon">Summary
        </a>
        <a href="../addTask/addTask.html" class="${currentPage.includes('addTask') ? 'active' : ''}">
          <img src="../assets/imgs/sidebarIcons/add_task.svg" alt="Add Task Icon">Add Task
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
    </div>
  `;
}

function getsummaryTemplate() {
    return `
Hallo, this is the summary template.
     `
}