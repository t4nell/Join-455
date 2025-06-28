/**
 * Renders the header component in the header container.
 *
 * @returns {void} Updates the header container with the header template.
 */
function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
};


/**
 * Initializes the help page by checking orientation, rendering elements, and updating user profile.
 *
 * @returns {void} Sets up the page layout and components.
 */
function init() {
    checkOrientation();
    initSidebar();
    renderHeader();
    updateUserProfile();
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
 * Checks the window size and renders the appropriate sidebar version (mobile or desktop).
 *
 * @returns {void} Updates the sidebar based on window width and adds a resize event listener.
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
 * @param {HTMLElement} mainContainer - The main navbar container element.
 * @param {HTMLElement} navContainer - The sidebar container element.
 * @param {HTMLElement} navbarMobileContainer - The mobile navbar container element.
 * @returns {void} Updates containers to show desktop sidebar layout.
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
 * @param {HTMLElement} mainContainer - The main navbar container element.
 * @param {HTMLElement} navContainer - The sidebar container element.
 * @param {HTMLElement} navbarMobileContainer - The mobile navbar container element.
 * @returns {void} Updates containers to show mobile sidebar layout.
 */
function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
};


/**
 * Navigates back to the previous page in browser history.
 *
 * @returns {void} Triggers browser back navigation.
 */
function goBack() {
    window.history.back();
};