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
            <div class="lock_icon_group">
              <input oninput="handlePasswordInput('loginPassword', 'lock_icon_container')" id="loginPassword" type="password" placeholder="Password" class="password_input">
              <div class="lock_icon" id="lock_icon_container">
                <img src="./assets/imgs/inputIcons/lock.png" alt="lock icon">
              </div>
            </div>
          </div>
          <div class="button_login_container">
            <button class="dark_btn login_btn">Log in</button>
            <button type="button" class="light_btn guest_login_btn">Guest Log in</button>
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
          <div class="lock_icon_group">
              <input
                          id="signupPassword"
                          type="password"
                          placeholder="Password"
                          class="password_input"
                          oninput="handlePasswordInput('signupPassword', 'sign_up_password_container'); disableSignupButton()" />
                <div class="lock_icon" id="sign_up_password_container">
                    <img src="./assets/imgs/inputIcons/lock.png" alt="lock icon" />
                </div>
          </div>
          <div class="lock_icon_group">
            <input
                id="signupConfirmPassword"
                type="password"
                placeholder="Confirm Password"
                class="password_input"
                oninput="handlePasswordInput('signupConfirmPassword', 'confirm_password_icon'); disableSignupButton()" />
            <div class="lock_icon" id="confirm_password_icon">
                <img src="./assets/imgs/inputIcons/lock.png" alt="lock icon" />
            </div>
          </div>
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
}

/**
 * Returns the HTML template for the sidebar navigation.
 *
 * Highlights the current page by checking the URL path and
 * adding the 'active' class to the corresponding navigation item.
 *
 * @returns {string} HTML string representing the sidebar navigation
 */
function getSidebarTemplate(currentPage) {
    return ` 
            <nav class="sidebar_nav">
                <a href="../summary/summary.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon" />
                    <span>Summary</span>
                </a>
                <a href="../addTask/addTask.html" class="nav_item ${currentPage.includes('addTask') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon" />
                    <span>Add Task</span>
                </a>
                <a href="../board/board.html" class="nav_item ${currentPage.includes('board') ? 'active' : ''}">
                    <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon" />
                    <span>Board</span>
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
}

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
      <div class="header_style">
        <div class="join_logo_mobile"><a href="../index.html"><img src="../assets/imgs/joinHeaderMobileIcon.svg" alt="join_mobile_logo"></a></div>
        <span>
          Kanban Project Management Tool
        </span>
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
      </div>
      
    </header>
  `;
}

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
  `;
}

/**
 * Returns the HTML template for the "password visibility off" icon.
 *
 * This template creates a clickable icon that toggles the password visibility
 * for a given input field. When clicked, it calls the togglePasswordVisibility
 * function with the specified icon container and input field IDs.
 *
 * @param {string} iconContainerId - The ID of the icon container element
 * @param {string} inputId - The ID of the password input field
 * @returns {string} HTML string representing the "visibility off" icon
 */
function passwordVisibilityOffTemplate(iconContainerId, inputId) {
    return `
        <div onclick="togglePasswordVisibility('${iconContainerId}', '${inputId}')">
            <img src="./assets/imgs/inputIcons/visibilityOffPassword.svg" alt="lock icon">
        </div>
    `;
}

/**
 * Returns the HTML template for the "password visibility on" icon.
 *
 * This template creates a clickable icon that toggles the password visibility
 * for a given input field. When clicked, it calls the togglePasswordVisibility
 * function with the specified icon container and input field IDs.
 *
 * @param {string} iconContainerId - The ID of the icon container element
 * @param {string} inputId - The ID of the password input field
 * @returns {string} HTML string representing the "visibility on" icon
 */
function passwordVisibilityOnTemplate(iconContainerId, inputId) {
    return `
        <div onclick="togglePasswordVisibility('${iconContainerId}', '${inputId}')">
            <img src="./assets/imgs/inputIcons/visibilityForPassword.svg" alt="lock icon">
        </div>
    `;
}

/**
 * Returns the HTML template for the default lock icon.
 *
 * This template displays a static lock icon, typically used for password input fields
 * when no visibility toggle is required.
 *
 * @returns {string} HTML string representing the default lock icon
 */
function defaultLockIconTemplate() {
    return `
        <div>
            <img src="./assets/imgs/inputIcons/lock.png" alt="lock icon">
        </div>
    `;
}



/**
 * Returns the HTML template for the sidebar navigation on desktopview coming from index page.
 *
 * @param {*} currentPage
 * @return {*} The HTML string representing the desktop sidebar navigation
 */
function rawSidebarDesktopRender(currentPage){
    return `            
            <nav class="sidebar_nav">
                <a href="../index.html" class="nav_item ${currentPage.includes('index') ? 'active' : ''}">
                    <img src="../assets/imgs/helpIcons/login.svg" alt="login icon" />
                    <span>Login</span>
                </a>
            </nav>

            <div class="sidebar_footer">
      <a href="../raw/privacyPolicy.html" class="${currentPage.includes('privacyPolicy') ? 'active' : ''}">Privacy Policy</a>
      <a href="../raw/legalNotice.html" class="${currentPage.includes('legal') ? 'active' : ''}">Legal Notice</a>
    </div>
`;
}


/**
 * Returns the HTML template for the sidebar navigation on mobile view coming from index page.
 *
 * @param {*} currentPage
 * @return {*} The HTML string representing the mobile sidebar navigation
 */
function getRawSidebarTemplateMobile(currentPage) {
  return ` 
    <div class="sidebar_container">  
   <nav class="sidebar_nav">
   <div>
  <a href="../index.html" class=" nav_item ${currentPage.includes('index') ? 'active' : ''} login_btn">
      <img src="../assets/imgs/helpIcons/login.svg" alt="login icon" />
    <span>Log In</span>
  </a>
</div>
  
<div class="page_links">
  <a href="./privacyPolicy.html" class="nav_item ${currentPage.includes('privacyPolicy') ? 'active' : ''}">
        <span>Privacy Policy</span>
  </a>
  <a href="./legalNotice.html" class="nav_item ${currentPage.includes('legalNotice') ? 'active' : ''}">
    <span>Legal Notice</span>
  </a>
  </div>
</nav>
</div>
  `
};


/**
 * Returns the HTML template for the header section in the legal and privacy pages coming from index page.
 *
 * @return {*} The HTML string representing the header section
 */
function getRawHeaderTemplate() {
    return ` 
    <header>
      <div class="header_style">
        <div class="join_logo_mobile"><a href="../index.html"><img src="../assets/imgs/joinHeaderMobileIcon.svg" alt="join_mobile_logo"></a></div>
        <span>
          Kanban Project Management Tool
        </span>

      </div>
      
    </header>
  `;
};