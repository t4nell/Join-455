function getLoginTemplate() {
    return `
      <div class="login_card">
          <div>
          <h2>Log in</h2>
          </div>
        <hr class="separator_horizontally">
        <form action="login" method="post">
          <div class="input_login_container">
            <input class="mail_input_icon" type="text" placeholder="E-Mail">
            <input class="lock_input_icon" type="password" placeholder="Password">
          </div>
          <div class="button_login_container">
            <button class="dark_btn">Log in</button>
            <button class="light_btn">Guest Log in</button>
          </div>
        </form>
      </div>
    `
}

function getSignupTemplate() {
    return `<div class="signup_card">
        <div>
        <a onclick="#"></a>
        
        <h2>Sign up</h2>
      </div>
      <hr class="separator_horizontally">
      <form action="login" method="post">
        <div class="input_login_container">
          <input class="name_input_icon" type="text" placeholder="Name">
          <input class="mail_input_icon" type="email" placeholder="E-Mail">
          <input class="lock_input_icon" type="password" placeholder="Password">
          <input class="lock_input_icon" type="password" placeholder="Confirm Password">
        </div>
        <div class="checkbox_container">
          <input type="checkbox" id="accept_policy" name="a" value="accept_policy">
          <label for="accept_policy">I accept the <a href="./policy/policy.html">Privacy policy</a></label>
        </div>
      
        <div class="button_signup_container">
          <button class="dark_btn">Sign up</button>
        </div>
      </form>
    </div>
  `
}