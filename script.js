const loginContainer = document.getElementById("login_container");
function init() {
    renderLogin();
}

function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginTemplate();
        loginContainer.style.display = 'flex';
        document.querySelector(".signup_login").style.display = "flex";
    }, 3000);
}

function toggleLoginSignup() {
    const loginContainer = document.getElementById('login_container');
    const signupContainer = document.getElementById('signup_container');
    const signupLoginDiv = document.querySelector('.signup_login');
    
    if (signupContainer.style.display === 'flex' || signupContainer.innerHTML.includes('signup_card')) {
        signupContainer.innerHTML = '';
        signupContainer.style.display = 'none';
        loginContainer.innerHTML = getLoginTemplate();
        loginContainer.style.display = 'flex';
        signupLoginDiv.innerHTML = `
            <span class="font_size_20px">Not a Join user?</span>
            <button class="dark_btn" onclick="toggleLoginSignup()">Sign up</button>
        `;
    } else {
        loginContainer.innerHTML = '';
        loginContainer.style.display = 'none';
        signupContainer.innerHTML = getSignupTemplate();
        signupContainer.style.display = 'flex';
        signupLoginDiv.innerHTML = `
            <span class="font_size_20px">Already a Join user?</span>
            <button class="dark_btn" onclick="toggleLoginSignup()">Log in</button>
        `;
    }
}