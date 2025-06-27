const mainContainer = document.getElementById('navbar_container');
const headerContainer = document.getElementById('header_container');

/** * Initializes the legal notes page and sets up the sidebar and header.
 * @returns {void} Sets up the page layout and updates user information.
 */


function init() {
    checkOrientation();
    initSidebar();
    renderHeader();
    rawSidebarDesktopRender();
}


/**
 * Renders the sidebar navigation menu
 *
 * @returns {void} Updates mainContainer with sidebar template
 */
function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}

/**
 * Renders the header section
 *
 * @returns {void} Updates headerContainer with header template
 */
function renderHeader() {
    headerContainer.innerHTML = getRawHeaderTemplate();
}

/**
 * Initializes the legal notes page components
 *
 * @returns {void} Sets up page layout and updates user information
 */

/**
 * Initializes the sidebar with event listeners and correct display.
 *
 * @returns {void} Sets up the sidebar responsiveness.
 */
function initSidebar() {
    const mediaQuery = window.matchMedia('(min-width: 1051px)');
    const handleBreakpoint = () => {
        proofSize();
    };
    mediaQuery.addEventListener('change', handleBreakpoint);
    proofSize();
}

/**
 * Checks the window size and renders the appropriate sidebar version.
 *
 * @returns {void} Updates the sidebar based on screen width.
 */
function proofSize() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');
    const width = window.innerWidth;
    if (width < 1051) {
        renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer);
    } else {
        renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer);
    }
}

/**
 * Renders the desktop version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for desktop view.
 */
function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = rawSidebarDesktopRender();
    navContainer.style.display = 'block';
}

/**
 * Renders the mobile version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for mobile view.
 */
function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}

function rawSidebarDesktopRender(){
    const currentPage = window.location.pathname;
    return `            
            <nav class="sidebar_nav">
                <a href="../index.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
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

function getSidebarTemplateMobile(currentPage) {
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