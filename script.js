const loginContainer = document.getElementById("login_container");


function init() {
    checkLoggedInUser();
    renderLogin();
};


function checkLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        window.location.href = './summary/summary.html';
    };
};


function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        const desktopSignup = document.getElementById("signup_login_desktop");
        const mobileSignup = document.getElementById("signup_login_mobile");
        function checkScreenSize() {
            if (window.innerWidth > 660) {
                desktopSignup.style.display = "flex";
                mobileSignup.style.display = "none";
            } else {
                desktopSignup.style.display = "none"; 
                mobileSignup.style.display = "flex";
            };
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        document.querySelector('.guest_login_btn').addEventListener('click', handleGuestLogin);
    }, 3000);
};


function toggleLoginSignup() {
    const signupLoginDiv = document.querySelector('.signup_login');
    const loginCard = document.querySelector('.login_card');
    const signupCard = document.querySelector('.signup_card');
    const mainSectionIndex = document.getElementById('main_section_index');
    if (loginCard && signupCard) {
        loginCard.classList.toggle('d_none');
        signupCard.classList.toggle('d_none');
        if (loginCard.classList.contains('d_none')) {
            signupLoginDiv.style.display = 'none';
            if (window.innerHeight < 1170) {
                mainSectionIndex.style.justifyContent = 'flex-end';
            };
        } else {
            signupLoginDiv.style.display = 'flex';
            mainSectionIndex.style.justifyContent = 'center';
        };
    };
};