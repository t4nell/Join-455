function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfileButton = document.querySelector('.user_profile');
    
    let userColor;
    
    if (currentUser) {
        if (!currentUser.profileColor) {
            // Nur wenn noch keine Farbe gespeichert ist, eine neue generieren
            const randomColorNumber = Math.floor(Math.random() * 20) + 1;
            userColor = `var(--profile-color-${randomColorNumber})`;
            
            // Farbe im currentUser-Objekt speichern
            currentUser.profileColor = userColor;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            // Gespeicherte Farbe verwenden
            userColor = currentUser.profileColor;
        }
        
        if (currentUser.name) {
            const nameParts = currentUser.name.split(' ');
            const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
            userProfileButton.textContent = initials;
        }
    } else {
        userProfileButton.textContent = 'G';  // G für Gast
        userColor = 'var(--profile-color-1)';  // Standardfarbe für Gäste
    }
    
    // Setze die Farbe als Hintergrund
    userProfileButton.style.setProperty('--current-profile-color', userColor);
}

function toggleUserMenu() {
    const userMenu = document.getElementById('user_dropdown_menu');
    userMenu.classList.toggle('d_none');
}

function closeUserMenuOnClickOutside(event) {
    const userMenu = document.getElementById('user_dropdown_menu');
    const userProfile = document.querySelector('.user_profile');
    
    if (userMenu && !userMenu.classList.contains('d_none')) {
        if (!userMenu.contains(event.target) && !userProfile.contains(event.target)) {
            userMenu.classList.add('d_none');
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

