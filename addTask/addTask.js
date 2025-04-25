const mainContainer = document.getElementById('main_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}
