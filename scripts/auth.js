/**
 * Hashes a password using PBKDF2 algorithm
 * 
 * @async
 * @param {string} password - The password to hash
 * @returns {Promise<string>} The hashed password with salt as hex string
 */
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
};


/**
 * Verifies a password against a stored hash
 * 
 * @async
 * @param {string} password - The password to verify
 * @param {string} storedHash - The stored hash to check against
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
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
};


/**
 * Handles the signup process
 * 
 * @async
 * @param {Event} event - The form submission event
 * @returns {void}
 */
async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const acceptPolicy = document.getElementById('accept_policy').checked;
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
};


/**
 * Handles the login process
 * 
 * @async
 * @param {Event} event - The form submission event
 * @returns {void}
 */
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
};


/**
 * Saves a user to local storage
 * 
 * @param {Object} user - The user object to save
 * @param {string} user.name - User's name
 * @param {string} user.email - User's email
 * @param {string} user.password - User's hashed password
 * @param {boolean} user.isGuest - Flag indicating if user is a guest
 * @returns {void}
 */
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Finds a user by email in local storage
 * 
 * @param {string} email - The email to search for
 * @returns {Object|undefined} The found user object or undefined
 */
function findUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.email === email);
};


/**
 * Handles guest login process
 * 
 * @returns {void}
 */
function handleGuestLogin() {
    const guestUser = {
        name: 'Guest User',
        email: 'guest@join.com',
        isGuest: true
    };

    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    window.location.href = './summary/summary.html';
};


/**
 * Shows a notification message
 * 
 * @param {string} message - The message to display
 * @param {boolean} [isError=false] - Whether this is an error message
 * @returns {void}
 */
function showNotification(message, isError = false) {
    const mainContainer = document.getElementById('main_container')
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    mainContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};


/**
 * Enables or disables the signup button based on form input values
 * 
 * Checks if all required fields in the signup form have values.
 * Enables the signup button only when all fields contain input.
 * 
 * @function
 * @returns {void}
 */
function disableSignupButton(){
    const signupButton = document.getElementById('signup_btn');
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupConfirmPassword');
    if (name.value.length > 0 && email.value.length > 0 && password.value.length > 0 && confirmPassword.value.length > 0) {
        signupButton.disabled = false;
    } else {
        signupButton.disabled = true;
    }
};