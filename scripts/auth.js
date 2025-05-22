/**
 * Authentication Module
 * Handles user authentication using PBKDF2 password hashing
 */

/**
 * Hashes a password using PBKDF2 algorithm
 * @async 
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Combined salt and hash as hex string
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
}

/**
 * Verifies a password against a stored hash
 * @async
 * @param {string} password - Plain text password to verify
 * @param {string} storedHash - Previously stored hash to compare against
 * @returns {Promise<boolean>} True if password matches
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
}

/**
 * Handles user registration process
 * @async
 * @param {Event} event - Form submission event
 * @returns {Promise<void>}
 */
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const acceptPolicy = document.getElementById('accept_policy').checked;    // Validation
    if (!acceptPolicy) {
        showNotification('Please accept the privacy policy', true);
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', true);
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', true);
        return;
    }
    
    if (findUser(email)) {
        showNotification('A user with this email already exists', true);
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
        saveUser(user);        showNotification('Registration successful!');
        toggleLoginSignup();
    } catch (error) {        console.error("Hashing failed:", error);
        showNotification('Technical error - please try again later', true);
    }
}

/**
 * Handles user login process
 * @async
 * @param {Event} event - Form submission event
 * @returns {Promise<void>}
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = findUser(email);    if (!user) {
        showNotification('Incorrect email or password', true);
        return;
    }

    try {
        const isMatch = await verifyPassword(password, user.password);
        if (isMatch) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = './summary/summary.html';        } else {
            showNotification('Incorrect email or password', true);
        }
    } catch (error) {        console.error("Verification failed:", error);
        showNotification('Technical error during login', true);
    }
}

/**
 * Saves user data to local storage
 * @param {Object} user - User data object
 * @param {string} user.name - User's full name
 * @param {string} user.email - User's email address
 * @param {string} user.password - Hashed password
 * @param {boolean} user.isGuest - Whether this is a guest account
 * @returns {void}
 */
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Finds a user by email address
 * @param {string} email - Email to search for
 * @returns {Object|undefined} User object if found
 */
function findUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.email === email);
}

/**
 * Creates a temporary guest account and redirects to summary page
 * @returns {void}
 */
function handleGuestLogin() {    const guestUser = {
        name: 'Guest User',
        email: 'guest@join.com',
        isGuest: true
    };

    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    window.location.href = './summary/summary.html';
}

/**
 * Displays a notification message
 * @param {string} message - Message to display
 * @param {boolean} [isError=false] - Whether this is an error message
 * @returns {void}
 */
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}