// PBKDF2-Funktionen
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const key = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, '0')).join('');
    return saltHex + hashHex;
}

async function verifyPassword(password, storedHash) {
    const encoder = new TextEncoder();
    const salt = new Uint8Array(
        storedHash.slice(0, 32).match(/.{2}/g).map(b => parseInt(b, 16))
    );
    const originalHash = storedHash.slice(32);
    
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const key = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    const newHash = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, '0')).join('');
    return newHash === originalHash;
}

// Registrierungsfunktion
async function handleSignup(event) {
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
    
    if (password.length < 8) {
        showNotification('Passwort muss mindestens 8 Zeichen haben', true);
        return;
    }
    
    if (findUser(email)) {
        showNotification('Ein Benutzer mit dieser E-Mail existiert bereits', true);
        return;
    }

    try {
        const hashedPassword = await hashPassword(password);
        const user = {
            name,
            email,
            password: hashedPassword,
            isGuest: false
        };
        saveUser(user);
        showNotification('Registrierung erfolgreich!');
        toggleLoginSignup();
    } catch (error) {
        console.error("Hashing fehlgeschlagen:", error);
        showNotification('Technischer Fehler - bitte versuchen Sie es später erneut', true);
    }
}

// Login-Funktion
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = findUser(email);

    if (!user) {
        showNotification('Falsche E-Mail oder Passwort', true);
        return;
    }

    try {
        const isMatch = await verifyPassword(password, user.password);
        if (isMatch) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = './summary/summary.html';
        } else {
            showNotification('Falsche E-Mail oder Passwort', true);
        }
    } catch (error) {
        console.error("Verifikation fehlgeschlagen:", error);
        showNotification('Technischer Fehler beim Login', true);
    }
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