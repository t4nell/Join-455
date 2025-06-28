/**
 * Updates the user profile display with initials and color
 * 
 * @returns {void}
 */
function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfileButton = document.querySelector('.user_profile');
    let userColor;
    userColor = setUserProfileInitials(currentUser, userColor, userProfileButton);
    userProfileButton.style.setProperty('--current-profile-color', userColor);
    document.addEventListener('click', closeUserMenuOnClickOutside);
};


/**
 * Sets the user's initials and color in the profile button.
 *
 * @param {Object} currentUser - The current user object from localStorage
 * @param {string} userColor - The current color value (can be undefined)
 * @param {HTMLElement} userProfileButton - The button element to display the user's initials
 * @returns {string} The user's profile color (CSS variable)
 */
function setUserProfileInitials(currentUser, userColor, userProfileButton) {
    if (currentUser) {
        userColor = getUserProfileColor(currentUser, userColor);
        if (currentUser.name) {
            const nameParts = currentUser.name.split(' ');
            const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
            userProfileButton.textContent = initials;
        }
    } else {
        userProfileButton.textContent = 'G';
        userColor = 'var(--profile-color-1)';
    }
    return userColor;
};


/**
 * Returns the user's profile color. If not set, assigns a random color and saves it.
 *
 * @param {Object} currentUser - The current user object from localStorage
 * @param {string} userColor - The current color value (can be undefined)
 * @returns {string} The user's profile color (CSS variable)
 */
function getUserProfileColor(currentUser, userColor) {
    if (!currentUser.profileColor) {
        const randomColorNumber = Math.floor(Math.random() * 20) + 1;
        userColor = `var(--profile-color-${randomColorNumber})`;
        currentUser.profileColor = userColor;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        userColor = currentUser.profileColor;
    }
    return userColor;
};


/**
 * Toggles the visibility of the user menu dropdown
 * 
 * @returns {void}
 */
function toggleUserMenu() {
    const userMenu = document.getElementById('user_dropdown_menu');
    userMenu.classList.toggle('d_none');
};


/**
 * Closes the user menu when clicking outside
 * 
 * @param {Event} event - The click event
 * @returns {void}
 */
function closeUserMenuOnClickOutside(event) {
    const userMenu = document.getElementById('user_dropdown_menu');
    const userProfile = document.querySelector('.user_profile');
    
    if (userMenu && !userMenu.classList.contains('d_none')) {
        if (!userMenu.contains(event.target) && !userProfile.contains(event.target)) {
            userMenu.classList.add('d_none');
        };
    };
};


/**
 * Handles user logout by clearing current user and redirecting
 * 
 * @returns {void}
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
};