const mainContainer = document.getElementById("navbar_container");
const headerContainer = document.getElementById("header_container");

function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}

function renderHeader() {
    headerContainer.innerHTML = getHeaderTemplate();
}

function init () {
    checkOrientation()
    renderSidebar();
    renderHeader();
    updateUserProfile()
}