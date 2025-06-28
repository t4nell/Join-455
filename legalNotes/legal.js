const mainContainer = document.getElementById('navbar_container');
const headerContainer = document.getElementById('header_container');

/** 
 * Initializes the legal notes page and sets up the sidebar and header.
 * 
 * @returns {void} Sets up the page layout and updates user information.
 */
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

