const loginContainer = document.getElementById("login_container");
function init() {
    renderLogin();
}
function renderLogin() {
    setTimeout(() => {
        loginContainer.innerHTML = getLoginTemplate();
        document.querySelector(".signup_login").style.display = "flex";
    }, 3000);
}