const mainContainer = document.getElementById("navbar_container");
const headerContainer = document.getElementById("header_container");

function renderSidebar() {
    mainContainer.innerHTML = getSidebarTemplate();
}

function renderHeader() {
    headerContainer.innerHTML = getHeaderTemplate();
}

window.onload = async function() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }

        renderSidebar();
        renderHeader();
        updateUserProfile();
    } catch (error) {
        console.error("Error initializing legal page:", error);
    }
};