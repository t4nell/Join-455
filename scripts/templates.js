/**
 * Returns the HTML template for the login and signup cards.
 * 
 * This template includes the login form with email and password inputs,
 * buttons for regular and guest login, and a signup form with input fields
 * for name, email, password, and password confirmation.
 * 
 * @returns {string} HTML string representing the login/signup interface
 */
function getLoginSignupTemplate() {
    return `
      <div class="login_card" id="loginCard">
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
      <form id="signupForm" class="signupForm" onsubmit="handleSignup(event)">
        <div class="input_login_container">
          <input id="signupName" class="name_input_icon" type="text" placeholder="Name" oninput="disableSignupButton()">
          <input id="signupEmail" class="mail_input_icon" type="email" placeholder="E-Mail" oninput="disableSignupButton()">
          <input id="signupPassword" class="lock_input_icon" type="password" placeholder="Password" oninput="disableSignupButton()">
          <input id="signupConfirmPassword" class="lock_input_icon" type="password" placeholder="Confirm Password" oninput="disableSignupButton()">
          <div class="checkbox_container">  
          <input type="checkbox" id="accept_policy" name="a" value="accept_policy">
          <label for="accept_policy">I accept the <a href="./policy/policy.html">Privacy policy</a></label>
          </div>
        </div>
        <div class="button_signup_container">
          <button id="signup_btn" class="dark_btn signup_btn" disabled>Sign up</button>
        </div>
      </form>
    </div>
  </div>
`;
};


/**
 * Returns the HTML template for the sidebar navigation.
 * 
 * Highlights the current page by checking the URL path and
 * adding the 'active' class to the corresponding navigation item.
 * 
 * @returns {string} HTML string representing the sidebar navigation
 */
function getSidebarTemplate() {
    const currentPage = window.location.pathname;
    return ` 
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
            <div class="sidebar_footer">
      <a href="../policy/policy.html" class="${currentPage.includes('policy') ? 'active' : ''}">Privacy Policy</a>
      <a href="../legalNotes/legal.html" class="${currentPage.includes('legal') ? 'active' : ''}">Legal Notice</a>
    </div>
`;
};


/**
 * Returns the HTML template for the header section.
 * 
 * Contains the Join logo, app title, help icon and user menu with dropdown.
 * 
 * @returns {string} HTML string representing the header section
 */
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
};


/**
 * Returns the HTML template for the mobile version of the sidebar navigation.
 * 
 * Highlights the current page by adding the 'active' class to the corresponding navigation item.
 * 
 * @param {string} currentPage - The current page path to determine which navigation item to highlight
 * @returns {string} HTML string representing the mobile sidebar navigation
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
  `
};