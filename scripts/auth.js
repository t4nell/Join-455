// Hilfsfunktionen für Passwort-Hashing (einfache Implementierung)
async function hashPassword(password) {
    // Generiere einen Salt und hashe das Passwort
    const salt = await bcrypt.genSalt(10); // 10 Runden für den Salt
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

// Benutzer im LocalStorage speichern
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Benutzer finden
function findUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.email === email);
}

// Registrierung behandeln
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const acceptPolicy = document.getElementById('accept_policy').checked;

    // Validierung
    if (!acceptPolicy) {
        showNotification('Bitte akzeptieren Sie die Datenschutzrichtlinie', true);
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwörter stimmen nicht überein', true);
        return;
    }
    
    if (findUser(email)) {
        showNotification('Ein Benutzer mit dieser E-Mail existiert bereits', true);
        return;
    }

    // Benutzer erstellen und speichern
    const hashedPassword = hashPassword(password);
    const user = {
        name,
        email,
        password: hashedPassword,
        isGuest: false
    };

    saveUser(user);
    showNotification('Registrierung erfolgreich! Bitte loggen Sie sich ein.');
    toggleLoginSignup(); // Zurück zum Login
}

// Login behandeln
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = findUser(email);

    if (!user) {
        alert('Falsche E-Mail oder Passwort');
        return;
    }

    // Passwort mit bcrypt vergleichen
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        alert('Falsche E-Mail oder Passwort');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = './summary/summary.html';
}

// Gast-Login
function handleGuestLogin() {
    const guestUser = {
        name: 'Gast Benutzer',
        email: 'guest@join.com',
        isGuest: true
    };

    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    window.location.href = './summary/summary.html';
}

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
