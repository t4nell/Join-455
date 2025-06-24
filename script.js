const loginContainer = document.getElementById("login_container");
const mainSectionIndex = document.getElementById('main_section_index');

/**
 * Initializes the login page with required checks
 * 
 * @returns {void} Checks orientation, logged in user and renders login
 */
function init() {
    checkOrientation()
    checkLoggedInUser();
    renderLogin();
};


/**
 * Checks if a user is already logged in
 * 
 * @returns {void} Redirects to summary page if user is logged in
 */
function checkLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        window.location.href = './summary/summary.html';
    };
};


/**
 * Adjusts signup display based on screen size
 * 
 * @returns {void} Updates visibility of desktop/mobile signup elements
 */
function checkScreenSize() {
    const desktopSignup = document.getElementById("signup_login_desktop");
    const mobileSignup = document.getElementById("signup_login_mobile");
    const loginCard = document.getElementById('loginCard');
    if (window.innerWidth > 660) {
        desktopSignup.style.display = "flex";
        mobileSignup.style.display = "none";
    } else {
        desktopSignup.style.display = "none"; 
        mobileSignup.style.display = "flex";
    };
    if (loginCard.classList.contains('d_none')) {
        desktopSignup.style.display = "none";
        mobileSignup.style.display = "none";
    }
    window.addEventListener('resize', checkScreenSize);
};


/**
 * Renders the login template after initial delay
 * 
 * @returns {void} Displays login container and sets up event listeners
 */
function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        setFlexEndForMobileLogin(mainSectionIndex)
        checkScreenSize();
        document.querySelector('.guest_login_btn').addEventListener('click', handleGuestLogin);
    }, 3000);
};


/**
 * Toggles between login and signup views
 * 
 * @returns {void} Switches visibility of login/signup cards
 */
function toggleLoginSignup() {
    const signupLoginDiv = document.querySelector('.signup_login');
    const mobileSignup = document.getElementById("signup_login_mobile");
    const loginCard = document.querySelector('.login_card');
    const signupCard = document.querySelector('.signup_card');
    if (loginCard && signupCard) {
        loginCard.classList.toggle('d_none');
        signupCard.classList.toggle('d_none');
        if (loginCard.classList.contains('d_none')) {
            signupLoginDiv.style.display = 'none';
            mobileSignup.style.display = 'none';
            disableSignupButton()
            setFlexEndForMobileSignup(mainSectionIndex);
        } else {
            toggleLoginSignupDisplay(signupLoginDiv, mobileSignup);
            setFlexEndForMobileLogin(mainSectionIndex)
        };
    };
};


/**
 * Updates login/signup display based on screen width
 * 
 * @param {HTMLElement} signupLoginDiv - Desktop signup/login container
 * @param {HTMLElement} mobileSignup - Mobile signup/login container
 * @returns {void} Sets appropriate display style based on window width
 */
function toggleLoginSignupDisplay(signupLoginDiv, mobileSignup) {
    if (window.innerWidth > 660) {
        signupLoginDiv.style.display = 'flex';
    } else {
        mobileSignup.style.display = 'flex';
    };
};


/**
 * Adjusts main section alignment for mobile login view
 * 
 * @param {HTMLElement} mainSectionIndex - Main section container element
 * @returns {void} Updates justifyContent based on window height
 */
function setFlexEndForMobileLogin(mainSectionIndex) {
    if (window.innerHeight < 880) {
        mainSectionIndex.style.justifyContent = 'flex-end';
    } else {
        mainSectionIndex.style.justifyContent = 'center';
    };
};


/**
 * Adjusts main section alignment for mobile signup view
 * 
 * @param {HTMLElement} mainSectionIndex - Main section container element
 * @returns {void} Updates justifyContent based on window height
 */
function setFlexEndForMobileSignup(mainSectionIndex) {
    if (window.innerHeight < 930) {
        mainSectionIndex.style.justifyContent = 'flex-end';
    } else {
        mainSectionIndex.style.justifyContent = 'center';
    };
};


/**
 * Handles redirection to previous page in history
 * 
 * @returns {void} Redirects to previous page in history
 */

function goBack() {
    window.history.back();
    console.log('Back button clicked');
    
}
