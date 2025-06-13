
const newContactPopup = document.getElementById('contact_popup');
const editContactPopup = document.getElementById('contact_edit_overlay');
const overlay = document.getElementById('contact_overlay');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const currentUserInitials = currentUser.name.split(' ').map((part) => part.charAt(0).toUpperCase()).join('');

/**
 * @description Initializes the contact page by checking screen size, rendering the header, and loading contact data. 
 *
 */
async function contactInit() {
    proofSize();
    checkOrientation();
    renderHeader();
    updateUserProfile();
    loadCurrentUser();
    await loadContactData();
}


/**
 *@description
 *
 */
function toggleOverlayNewContact() {
    popup.classList.toggle('closed');
    overlay.classList.toggle('fade_out');
}


/**
 * @description Renders the header 
 *
 */
function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * @description closes the overlay and popups
 *
 */
function toggleOverlay() {
    overlay.classList.add('fade_out');
    newContactPopup.classList.add('closed');
    editContactPopup.classList.add('closed');
}

/**
 * @description Stops event bubbling to prevent unwanted propagation of events
 *
 * @param {*} event - The event object that triggered the bubbling.
 */
function eventBubbling(event) {
    event.stopPropagation();
}


/**
 * @description Opens the new contact overlay for creating new contact.
 *
 */
function newContactOverlay() {
    overlay.classList.remove('fade_out');
    newContactPopup.classList.remove('closed');
    newContactPopup.innerHTML = getNewContactOverlay();
}


/**
 * @description Opens the edit contact overlay for editing an existing contact.
 *
 * @param {*} contactIndex - The index of the contact to be edited in the contactsArray.
 */
function editContactOverlay(contactIndex) {
    overlay.classList.remove('fade_out');
    editContactPopup.classList.remove('closed');
    const contact = contactsArray[contactIndex];

    editContactPopup.innerHTML = getEditContactOverlay(contact, contactIndex);
    console.log(contact);
    document.getElementById('edit_name').value = contact.name + ' ' + contact.surname;
    document.getElementById('edit_mail').value = contact.email;
    document.getElementById('edit_phone').value = contact.phone;
}


/**
 * @description Closes the contact main view and resets the contact list for mobile view.
 *
 */
function closeContactMain() {
    const allContacts = document.querySelectorAll('.contact_side');
    document.querySelector('.contact_container').classList.add('mobile_closed');
    allContacts.forEach((contact) => contact.classList.remove('active'));
    const contactMainContainer = document.getElementById('contact_detail_container');
    contactMainContainer.classList.add('closed');
}


/**
 * @description Toggles the contact options dropdown menu for deleting or edit contact.
 *
 * @param {*} event - The event object that triggered the toggle.
 */
function toggleContactOptions(event) {
    event.stopPropagation();
    document.getElementById('contact_options_dropdown').classList.remove('closed');
    setTimeout(() => {
        document.addEventListener('click', closeContactMenuOnClickOutside);
    }, 0);
}


/**
 * @description Closes the contact options dropdown menu when clicking outside of it.
 *
 * @param {*} event - The event object that triggered the click outside.
 */
function closeContactMenuOnClickOutside(event) {
    const contactMenu = document.getElementById('contact_options_dropdown');
    if (!contactMenu.classList.contains('closed') && !contactMenu.contains(event.target)) {
        contactMenu.classList.add('closed');
        document.removeEventListener('click', closeContactMenuOnClickOutside);
    }
}


/**
 * @description Adjusts the sidebar layout based on the screen size.
 *
 */
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


/**
 * @description Checks the orientation of the device and adjusts the sidebar position accordingly.
 *
 * @param {*} mainContainer - The main container where the sidebar will be rendered.
 * @param {*} navContainer - The navigation container for the sidebar.
 * @param {*} navbarMobileContainer - The mobile navigation container for the sidebar.
 */
function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate();
    navContainer.style.display = 'block';
}


/**
 * @description Renders the sidebar for mobile view.
 *
 * @param {*} mainContainer - The main container where the sidebar will be rendered.
 * @param {*} navContainer - The navigation container for the sidebar.
 * @param {*} navbarMobileContainer 
 */
function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}