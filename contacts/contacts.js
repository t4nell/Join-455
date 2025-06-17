
const newContactPopup = document.getElementById('contact_popup');
const editContactPopup = document.getElementById('contact_edit_overlay');
const overlay = document.getElementById('contact_overlay');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const currentUserInitials = currentUser.name.split(' ').map((part) => part.charAt(0).toUpperCase()).join('');

/**
 * Initializes the contact page by checking screen size, rendering the header, and loading contact data. 
 *
 * @returns {void}
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
 * displays or closes Popup and Overlay for new contact or edit popup.
 *
 * @returns {void}
 */
function toggleOverlayNewContact() {
    popup.classList.toggle('closed');
    overlay.classList.toggle('fade_out');
}


/**
 * Renders the header 
 *
 * @returns {void}
 */
function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

/**
 * closes the overlay and popups
 *
 *@returns {void}
 */
function toggleOverlay() {
    overlay.classList.add('fade_out');
    newContactPopup.classList.add('closed');
    editContactPopup.classList.add('closed');
}

/**
 * Stops event bubbling to prevent unwanted propagation of events
 *
 * @returns {void}
 * @param {*} event - The event object that triggered the bubbling.
 */
function eventBubbling(event) {
    event.stopPropagation();
}


/**
 * Opens the new contact overlay for creating new contact.
 *
 * @returns {void}
 */
function newContactOverlay() {
    overlay.classList.remove('fade_out');
    newContactPopup.classList.remove('closed');
    newContactPopup.innerHTML = getNewContactOverlay();
}


/**
 * Opens the edit contact overlay for editing an existing contact.
 *
 * @param {*} contactIndex - The index of the contact to be edited in the contactsArray.
 * @returns {void}
 */
function editContactOverlay(contactIndex) {
    overlay.classList.remove('fade_out');
    editContactPopup.classList.remove('closed');
    const contact = contactsArray[contactIndex];

    editContactPopup.innerHTML = getEditContactOverlay(contact, contactIndex);
    document.getElementById('edit_name').value = contact.name + ' ' + contact.surname;
    document.getElementById('edit_mail').value = contact.email;
    document.getElementById('edit_phone').value = contact.phone;
}


/**
 * Closes the contact main view and resets the contact list for mobile view.
 *
 * @returns {void}
 */
function closeContactMain() {
    const allContacts = document.querySelectorAll('.contact_side');
    document.querySelector('.contact_container').classList.add('mobile_closed');
    allContacts.forEach((contact) => contact.classList.remove('active'));
    const contactMainContainer = document.getElementById('contact_detail_container');
    contactMainContainer.classList.add('closed');
}


/**
 * Toggles the contact options dropdown menu for deleting or edit contact.
 *
 * @param {*} event - The event object that triggered the toggle.
 * @returns {void}
 */
function toggleContactOptions(event) {
    event.stopPropagation();
    document.getElementById('contact_options_dropdown').classList.remove('closed');
    setTimeout(() => {
        document.addEventListener('click', closeContactMenuOnClickOutside);
    }, 0);
}


/**
 * Closes the contact options dropdown menu when clicking outside of it.
 *
 * @param {*} event - The event object that triggered the click outside.
 * @returns {void}
 */
function closeContactMenuOnClickOutside(event) {
    const contactMenu = document.getElementById('contact_options_dropdown');
    if (!contactMenu.classList.contains('closed') && !contactMenu.contains(event.target)) {
        contactMenu.classList.add('closed');
        document.removeEventListener('click', closeContactMenuOnClickOutside);
    }
}


/**
 * Adjusts the sidebar layout based on the screen size.
 *
 * @returns {void}
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
 * Checks the orientation of the device and adjusts the sidebar position accordingly.
 *
 * @param {*} mainContainer - The main container where the sidebar will be rendered.
 * @param {*} navContainer - The navigation container for the sidebar.
 * @param {*} navbarMobileContainer - The mobile navigation container for the sidebar.
 * @returns {void}
 */
function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate();
    navContainer.style.display = 'block';
}


/**
 * Renders the sidebar for mobile view.
 *
 * @param {*} mainContainer - The main container where the sidebar will be rendered.
 * @param {*} navContainer - The navigation container for the sidebar.
 * @param {*} navbarMobileContainer 
 * @returns {void}
 */
function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}