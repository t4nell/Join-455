const mainContainer = document.getElementById("navbar_container");
const headerContainer = document.getElementById("header_container");

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
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * Initializes the legal notes page components
 * 
 * @returns {void} Sets up page layout and updates user information
 */
function init () {
    checkOrientation()
    renderSidebar();
    renderHeader();
    updateUserProfile()
}