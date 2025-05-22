/**
 * User Profile Management Module
 */

/**
 * Updates the user profile display in the UI
 * Sets the profile color and initials based on user data
 * @returns {void}
 */
function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfileButton = document.querySelector('.user_profile');
    
    let userColor;
    
    if (currentUser) {
        if (!currentUser.profileColor) {
            // Only generate a new color if none is saved
            const randomColorNumber = Math.floor(Math.random() * 20) + 1;
            userColor = `var(--profile-color-${randomColorNumber})`;
            
            // Save color in currentUser object
            currentUser.profileColor = userColor;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            // Use saved color
            userColor = currentUser.profileColor;
        }
        
        if (currentUser.name) {
            const nameParts = currentUser.name.split(' ');
            const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
            userProfileButton.textContent = initials;
        }
    } else {
        userProfileButton.textContent = 'G';  // G for Guest
        userColor = 'var(--profile-color-1)';  // Default color for guests
    }
    
    // Set the color as background
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
 * Handles click events outside the user menu to close it
 * @param {Event} event - Click event object
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
 * Logs out the current user
 * Removes user data from localStorage and redirects to login page
 * @returns {void}
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

