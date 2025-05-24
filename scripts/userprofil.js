/**
 * Updates the user profile display with initials and color
 * @returns {void}
 */
function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfileButton = document.querySelector('.user_profile');
    
    let userColor;
    
    if (currentUser) {
        if (!currentUser.profileColor) {
            const randomColorNumber = Math.floor(Math.random() * 20) + 1;
            userColor = `var(--profile-color-${randomColorNumber})`;
            
            // save the color to the current user
            currentUser.profileColor = userColor;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            // user has a profile color
            userColor = currentUser.profileColor;
        }
        
        if (currentUser.name) {
            const nameParts = currentUser.name.split(' ');
            const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
            userProfileButton.textContent = initials;
        }
    } else {
        userProfileButton.textContent = 'G';  // use G for Guest
        userColor = 'var(--profile-color-1)';  // color for Guest
    }
    
    // set the profile color
    userProfileButton.style.setProperty('--current-profile-color', userColor);
    //close user menu
    document.addEventListener('click', closeUserMenuOnClickOutside);
}

/**
 * Toggles the visibility of the user menu dropdown
 * @returns {void}
 */
function toggleUserMenu() {
    const userMenu = document.getElementById('user_dropdown_menu');
    userMenu.classList.toggle('d_none');
}

/**
 * Closes the user menu when clicking outside
 * @param {Event} event - The click event
 * @returns {void}
 */
function closeUserMenuOnClickOutside(event) {
    const userMenu = document.getElementById('user_dropdown_menu');
    const userProfile = document.querySelector('.user_profile');
    
    if (userMenu && !userMenu.classList.contains('d_none')) {
        if (!userMenu.contains(event.target) && !userProfile.contains(event.target)) {
            userMenu.classList.add('d_none');
        }
    }
}

/**
 * Handles user logout by clearing current user and redirecting
 * @returns {void}
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}