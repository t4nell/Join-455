const loginContainer = document.getElementById("login_container");


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

function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        checkScreenSize();
        document.querySelector('.guest_login_btn').addEventListener('click', handleGuestLogin);
    }, 3000);
};


function toggleLoginSignup() {
    const signupLoginDiv = document.querySelector('.signup_login');
    const mobileSignup = document.getElementById("signup_login_mobile");
    const loginCard = document.querySelector('.login_card');
    const signupCard = document.querySelector('.signup_card');
    const mainSectionIndex = document.getElementById('main_section_index');
    if (loginCard && signupCard) {
        loginCard.classList.toggle('d_none');
        signupCard.classList.toggle('d_none');
        if (loginCard.classList.contains('d_none')) {
            signupLoginDiv.style.display = 'none';
            mobileSignup.style.display = 'none';
            setFlexEndForMobile(mainSectionIndex);
        } else {
            toggleLoginSignupDisplay(signupLoginDiv, mobileSignup);
            mainSectionIndex.style.justifyContent = 'center';
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


function setFlexEndForMobile(mainSectionIndex) {
    if (window.innerHeight < 1170) {
        mainSectionIndex.style.justifyContent = 'flex-end';
    };
};