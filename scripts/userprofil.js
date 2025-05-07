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
    const menu = document.getElementById('user_dropdown_menu');
    menu.classList.toggle('d_none');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

