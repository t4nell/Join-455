
const loginContainer = document.getElementById("login_container");

function init() {
    checkLoggedInUser();
    renderLogin();
    document.addEventListener('click', closeUserMenuOnClickOutside);
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
        document.querySelector('.guest_login_btn').addEventListener('click', handleGuestLogin);
    }, 3000);
}

function toggleLoginSignup() {
    const signupLoginDiv = document.querySelector('.signup_login');
    const loginCard = document.querySelector('.login_card');
    const signupCard = document.querySelector('.signup_card');

    if (loginCard && signupCard) {
        loginCard.classList.toggle('d_none');
        signupCard.classList.toggle('d_none');
       
        if (loginCard.classList.contains('d_none')) {
            signupLoginDiv.style.display = 'none';
        } else {
            signupLoginDiv.style.display = 'flex';
        }
    }
}


async function loadAllData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    const data = responseToJson;
    console.log(data);
    
    const allData = Object.keys(data);
    console.log(allData);
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

// ersten Buchstaben des Vornamens und Nachnamens extrahieren und in eine Variable speichern

// function getInitialsFromLocalStorage() {
//     const userData = JSON.parse(localStorage.getItem('currentUser'));
    
//     if (!userData || !userData.name) {
//         return null;
//     }

//     const nameParts = userData.name.trim().split(' ');
    
//     // Initialen extrahieren
//     let initials = '';
//     if (nameParts.length > 0) {
//         initials += nameParts[0].charAt(0).toUpperCase();
//     }
//     if (nameParts.length > 1) {
//         initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
//     }

//     return initials || null;
// }

// const userInitials = getInitialsFromLocalStorage();
// console.log(userInitials);