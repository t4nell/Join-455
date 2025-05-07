function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfileButton = document.querySelector('.user_profile');
    
    // Wähle eine zufällige Farbe zwischen 1 und 20
    const randomColorNumber = Math.floor(Math.random() * 20) + 1;
    const randomColor = `var(--profile-color-${randomColorNumber})`;
    
    if (currentUser && currentUser.name) {
        const nameParts = currentUser.name.split(' ');
        const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
        userProfileButton.textContent = initials;
    } else {
        userProfileButton.textContent = 'G';  // G für Gast
    }
    
    // Setze die zufällige Farbe als Hintergrund
    userProfileButton.style.setProperty('--current-profile-color', randomColor);
}