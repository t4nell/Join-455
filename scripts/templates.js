function getLoginTemplate() {
    return `

      <div class="login_card">
          <div>
          <h2>Log in</h2>
        </div>
        
        <hr class="separator_horizontally">

        <form action="login" method="post">

          <div class="input_login_container">
            <input class="login_input_icon" type="text" placeholder="E-Mail">
            <input type="password" placeholder="Password">
          </div>
          
          <div class="button_login_container">
            <button class="dark_btn">Log in</button>
            <button class="light_btn">Guest Log in</button>
          </div>

        </form>

      </div>
        

    
    `
}