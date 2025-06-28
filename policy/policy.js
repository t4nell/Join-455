const mainContainer = document.getElementById('navbar_container');
const headerContainer = document.getElementById('header_container');


function init() {
    checkOrientation();
    renderHeader();
    updateUserProfile();
    initSidebar();
};


/**
 * Renders the header section
 *
 * @returns {void} Updates headerContainer with header template
 */
function renderHeader() {
    headerContainer.innerHTML = getHeaderTemplate();
};


/**
 * Initializes the sidebar with event listeners and correct display.
 *
 * @returns {void} Sets up the sidebar responsiveness.
 */
function initSidebar() {
    const mediaQuery = window.matchMedia('(min-width: 1050px)');
    const handleBreakpoint = () => {
        proofSize();
    };
    mediaQuery.addEventListener('change', handleBreakpoint);
    proofSize();
};


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
    if (width < 1050) {
        renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer);
    } else {
        renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer);
    };
};


/**
 * Renders the desktop version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for desktop view.
 */
function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate(currentPage);
    navContainer.style.display = 'block';
};


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
};


/**
 * Creates the template for the mobile navigation bar.
 *
 * @param {string} currentPage - Path of the current page for highlighting the active menu item.
 * @returns {string} HTML template for the mobile navigation.
 */
function getSidebarTemplateMobile(currentPage) {
    return ` 
    <div class="sidebar_container">
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
        </div>
`;
};