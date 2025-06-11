function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

function init() {
    checkOrientation()
    proofSize();
    renderHeader();
    updateUserProfile();
}

function proofSize() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');
    const width = window.innerWidth;
    if (width < 1052) {
        renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer);
    } else {
        renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer);
    }
    window.addEventListener('resize', proofSize);
}


function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate();
    navContainer.style.display = 'block';
}

function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}

function goBack() {
    window.history.back();
}

