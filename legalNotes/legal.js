const mainContainer = document.getElementById("navbar_container");

function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}