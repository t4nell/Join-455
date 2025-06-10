const loginContainer = document.getElementById("login_container");
const mainSectionIndex = document.getElementById('main_section_index');

function init() {
    checkOrientation()
    checkLoggedInUser();
    renderLogin();
};


function checkLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        window.location.href = './summary/summary.html';
    };
};

function checkScreenSize() {
    const desktopSignup = document.getElementById("signup_login_desktop");
    const mobileSignup = document.getElementById("signup_login_mobile");
    if (window.innerWidth > 660) {
        desktopSignup.style.display = "flex";
        mobileSignup.style.display = "none";
    } else {
        desktopSignup.style.display = "none"; 
        mobileSignup.style.display = "flex";
    };
    window.addEventListener('resize', checkScreenSize);
};

function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        setFlexEndForMobileLogin(mainSectionIndex)
        checkScreenSize();
        document.querySelector('.guest_login_btn').addEventListener('click', handleGuestLogin);
    }, 3000);
};


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
            setFlexEndForMobileSignup(mainSectionIndex);
        } else {
            toggleLoginSignupDisplay(signupLoginDiv, mobileSignup);
            setFlexEndForMobileLogin(mainSectionIndex)
        };
    };
};


function toggleLoginSignupDisplay(signupLoginDiv, mobileSignup) {
    if (window.innerWidth > 660) {
        signupLoginDiv.style.display = 'flex';
    } else {
        mobileSignup.style.display = 'flex';
    };
};


function setFlexEndForMobileLogin(mainSectionIndex) {
    if (window.innerHeight < 990) {
        mainSectionIndex.style.justifyContent = 'flex-end';
    } else {
        mainSectionIndex.style.justifyContent = 'center';
    };
};


function setFlexEndForMobileSignup(mainSectionIndex) {
    if (window.innerHeight < 1170) {
        mainSectionIndex.style.justifyContent = 'flex-end';
    } else {
        mainSectionIndex.style.justifyContent = 'center';
    };
};