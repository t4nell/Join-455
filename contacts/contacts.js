const mainContainer = document.getElementById('navbar_container');
const newContactPopup = document.getElementById('contact_popup');
const editContactPopup = document.getElementById('contact_edit_overlay');
const overlay = document.getElementById('contact_overlay');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const currentUserInitials = currentUser.name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

async function contactInit() {
    checkOrientation();
    renderHeader();
    renderSidebar();
    updateUserProfile();
    loadCurrentUser();
    await loadContactData();
    // groupContacts();
}

//kontakte fetchen
//kontakte nach name sortieren
//kontakte in array speichern
//kontakte in html rendern

// function renderSidebar() {
//   mainContainer.innerHTML += getSidebarTemplate();
// }

function toggleOverlayNewContact() {
    popup.classList.toggle('closed');
    overlay.classList.toggle('fade_out');
}

function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

function toggleOverlay() {
    overlay.classList.add('fade_out');
    newContactPopup.classList.add('closed');
    editContactPopup.classList.add('closed');
}

function eventBubbling(event) {
    event.stopPropagation();
}

function newContactOverlay() {
    overlay.classList.remove('fade_out');
    newContactPopup.classList.remove('closed');
    newContactPopup.innerHTML = getNewContactOverlay();
}

function editContactOverlay(contactIndex) {
    overlay.classList.remove('fade_out');
    editContactPopup.classList.remove('closed');

    // const clickedContact = event.currentTarget
    const contact = contactsArray[contactIndex];
    editContactPopup.innerHTML = getEditContactOverlay(contact, contactIndex);
    console.log(contact);
    document.getElementById('edit_name').value = contact.name + ' ' + contact.surname;
    document.getElementById('edit_mail').value = contact.email;
    document.getElementById('edit_phone').value = contact.phone;
}

function closeContactMain() {
    const allContacts = document.querySelectorAll('.contact_side');
    document.querySelector('.contact_container').classList.add('mobile_closed');
    allContacts.forEach((contact) => contact.classList.remove('active'));
    const contactMainContainer = document.getElementById('contact_detail_container');
    contactMainContainer.classList.add('closed');
}

function toggleContactOptions(event) {
    event.stopPropagation();
    document.getElementById('contact_options_dropdown').classList.remove('closed');
    setTimeout(() => {
        document.addEventListener('click', closeContactMenuOnClickOutside);
    }, 0);
}

function closeContactMenuOnClickOutside(event) {
    const contactMenu = document.getElementById('contact_options_dropdown');
    if (!contactMenu.classList.contains('closed') && !contactMenu.contains(event.target)) {
        contactMenu.classList.add('closed');
        document.removeEventListener('click', closeContactMenuOnClickOutside);
    }
}

console.log('----------------Mobile SideBar Template----------------------');

function getSidebarTemplateMobile() {
    const currentPage = window.location.pathname;
    return ` 
    <div class="sidebar_container">  
   <nav class="sidebar_nav">
  <a href="../summary/summary.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon">
    <span>Summary</span>
  </a>
   <a href="../board/board.html" class="nav_item ${currentPage.includes('board') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon">
    <span>Board</span>
  </a>
  <a href="../addTask/addTask.html" class="nav_item ${currentPage.includes('addTask') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon">
    <span>Add Task</span>
  </a>
 
  <a href="../contacts/contacts.html" class="nav_item ${currentPage.includes('contacts') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/contacts.svg" alt="Contacts Icon">
    <span>Contacts</span>
  </a>
</nav>
</div>

  `;
}

console.log('----------------Mobile SideBar----------------------');

function renderSidebar() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');

    function renderSidebarDesktop() {
        navbarMobileContainer.innerHTML = '';
        mainContainer.innerHTML = getSidebarTemplate();
        navContainer.style.display = 'block';
    }

    function renderSidebarMobile() {
        mainContainer.innerHTML = '';
        navbarMobileContainer.innerHTML = getSidebarTemplateMobile();
        navContainer.style.display = 'none';
    }

    function proofSize() {
        const width = window.innerWidth;
        if (width < 1052) {
            renderSidebarMobile();
        } else {
            renderSidebarDesktop();
        }
    }

    window.addEventListener('resize', proofSize);
    proofSize();
}

