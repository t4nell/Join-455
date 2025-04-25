const loginContainer = document.getElementById("login_container");
function init() {
    renderLogin();
}

function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        document.querySelector(".signup_login").style.display = "flex";
    }, 3000);
}

function toggleLoginSignup() {
    const signupLoginDiv = document.querySelector('.signup_login');
    const loginCard = document.querySelector('.login_card');
    const signupCard = document.querySelector('.signup_card');

    loginCard.classList.toggle('d_none');
    signupCard.classList.toggle('d_none');
   
    if (loginCard.classList.contains('d_none')) {
        signupLoginDiv.style.display = 'none';
    } else {
        signupLoginDiv.style.display = 'flex';
    }
}