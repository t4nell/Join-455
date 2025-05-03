const loginContainer = document.getElementById("login_container");

function init() {
    renderLogin();
    checkLoggedInUser();
}

function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        document.querySelector(".signup_login").style.display = "flex";
    }, 3000);
}

// Prüfen ob bereits eingeloggt
function checkLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        window.location.href = './summary/summary.html';
    }
}


function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginSignupTemplate();
        loginContainer.style.display = 'flex';
        document.querySelector(".signup_login").style.display = "flex";
        
        // Gast-Login Button Event hinzufügen
        document.querySelector('.guest_login_btn').onclick = handleGuestLogin;
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

//https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// https://www.w3schools.com/js/js_api_web_storage.asp

// Gastfunction

// // Am Anfang jeder Seite:
// const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// if (!currentUser) {
//     window.location.href = '../index.html';
// }

// if (currentUser.isGuest) {
//     // Gast-spezifische Einschränkungen
//     document.querySelectorAll('.restricted-feature').forEach(el => {
//         el.style.display = 'none';
//     });
//     alert('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
// }