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
    const key = await generateKeyFromPassword(salt, keyMaterial);
    const { saltHex, hashHex } = convertSaltAndKeyToHex(salt, key);
    return saltHex + hashHex;
};


/**
 * Derives a cryptographic key from a password using PBKDF2.
 *
 * @async
 * @param {Uint8Array} salt - The salt value as a byte array
 * @param {CryptoKey} keyMaterial - The imported key material from the password
 * @returns {Promise<ArrayBuffer>} The derived key as an ArrayBuffer
 */
async function generateKeyFromPassword(salt, keyMaterial) {
    return await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    );
};


/**
 * Converts the salt and derived key (hash) into hexadecimal string representations.
 *
 * @param {Uint8Array} salt - The salt value as a byte array
 * @param {ArrayBuffer} key - The derived key (hash) as an ArrayBuffer
 * @returns {Object} An object containing the salt and hash as hex strings: { saltHex, hashHex }
 */
function convertSaltAndKeyToHex(salt, key) {
    const saltHex = Array.from(salt)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    const hashHex = Array.from(new Uint8Array(key))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return { saltHex, hashHex };
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
    const salt = convertHashToUint8Array(storedHash);
    const originalHash = storedHash.slice(32);
    const keyMaterial = await importKeyFromPassword(encoder, password);
    const key = await generateDerivedKey(salt, keyMaterial);
    const newHash = Array.from(new Uint8Array(key))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return newHash === originalHash;
};


/**
 * Imports a raw password as a CryptoKey for use with PBKDF2 key derivation.
 *
 * @async
 * @param {TextEncoder} encoder - The TextEncoder instance to encode the password
 * @param {string} password - The password to import as key material
 * @returns {Promise<CryptoKey>} The imported CryptoKey object
 */
async function importKeyFromPassword(encoder, password) {
    return await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
};


/**
 * Converts a hexadecimal hash string (salt part) into a Uint8Array.
 *
 * @param {string} storedHash - The stored hash string (salt + hash in hex)
 * @returns {Uint8Array} The salt as a Uint8Array
 */
function convertHashToUint8Array(storedHash) {
    return new Uint8Array(
        storedHash
            .slice(0, 32)
            .match(/.{2}/g)
            .map((b) => parseInt(b, 16))
    );
};


/**
 * Derives a cryptographic key from a password using PBKDF2.
 *
 * @async
 * @param {Uint8Array} salt - The salt value as a byte array
 * @param {CryptoKey} keyMaterial - The imported key material from the password
 * @returns {Promise<ArrayBuffer>} The derived key as an ArrayBuffer
 */
async function generateDerivedKey(salt, keyMaterial) {
    return await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        256
    );
};


/**
 * Validates email format using regex
 *
 * @param {string} email - The email to validate
 * @returns {boolean} True if email format is valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || email.length === 0) return false;
    if (email.length > 254) return false;
    if (!email.includes('@')) return false;
    if (!email.includes('.')) return false;
    const atIndex = email.lastIndexOf('@');
    const dotIndex = email.lastIndexOf('.');
    if (dotIndex <= atIndex) return false;
    const domainPart = email.substring(dotIndex + 1);
    if (domainPart.length < 2) return false;
    return emailRegex.test(email);
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
    const { email, acceptPolicy, password, confirmPassword, name } = getSignUpData();
    if (!validateEmail(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', true);
        return;
    }
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
    await registerUser(password, name, email);
};


/**
 * Collects all input values from the signup form fields and returns them as an object.
 *
 * @returns {Object} An object containing name, email, password, confirmPassword, and acceptPolicy
 */
function getSignUpData() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const acceptPolicy = document.getElementById('accept_policy').checked;
    return { email, acceptPolicy, password, confirmPassword, name };
};


/**
 * Registers a new user by hashing the password, saving the user data, and updating the UI.
 *
 * @async
 * @param {string} password - The user's plain text password
 * @param {string} name - The user's name
 * @param {string} email - The user's email address
 * @returns {Promise<void>} Registers the user and updates the UI
 */
async function registerUser(password, name, email) {
    try {
        const hashedPassword = await hashPassword(password);
        const user = {
            name,
            email,
            password: hashedPassword,
            isGuest: false,
        };
        saveUser(user);
        showNotification('Registrierung erfolgreich!');
        clearSignupFields();
        toggleLoginSignup();
    } catch (error) {
        console.error('Hashing fehlgeschlagen:', error);
        showNotification('Technischer Fehler - bitte versuchen Sie es später erneut', true);
    };
};


/**
 * Clears all signup form fields
 *
 * @returns {void}
 */
function clearSignupFields() {
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
    document.getElementById('accept_policy').checked = false;
    const signupButton = document.getElementById('signup_btn');
    if (signupButton) {
        signupButton.disabled = true;
    };
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
    if (!validateEmail(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', true);
        return;
    }
    const user = findUser(email);
    if (!user) {
        showNotification('Falsche E-Mail oder Passwort', true);
        return;
    }
    await verifyUserPassword(password, user);
};


/**
 * Verifies the user's password by comparing the entered password with the stored hashed password.
 *
 * @async
 * @param {string} password - The password entered by the user
 * @param {Object} user - The user object containing the stored hashed password
 * @returns {Promise<void>} Sets the user in localStorage and redirects on success, shows error on failure
 */
async function verifyUserPassword(password, user) {
    try {
        const isMatch = await verifyPassword(password, user.password);
        if (isMatch) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = './summary/summary.html';
        } else {
            showNotification('Falsche E-Mail oder Passwort', true);
        }
    } catch (error) {
        console.error('Verifikation fehlgeschlagen:', error);
        showNotification('Technischer Fehler beim Login', true);
    };
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
};


/**
 * Finds a user by email in local storage
 *
 * @param {string} email - The email to search for
 * @returns {Object|undefined} The found user object or undefined
 */
function findUser(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find((u) => u.email === email);
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
        isGuest: true,
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
    const mainContainer = document.getElementById('main_container');
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
function disableSignupButton() {
    const signupButton = document.getElementById('signup_btn');
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupConfirmPassword');
    if (
        name.value.length > 0 &&
        email.value.length > 0 &&
        password.value.length > 0 &&
        confirmPassword.value.length > 0
    ) {
        signupButton.disabled = false;
    } else {
        signupButton.disabled = true;
    };
};


/**
 * Handles the password input field and updates the icon based on the input value and visibility state.
 *
 * Shows the "password visible" or "password hidden" icon if the field is not empty,
 * otherwise displays the default lock icon. Should be called on every input event of the password field.
 *
 * @param {string} inputId - The ID of the password input field
 * @param {string} iconContainerId - The ID of the icon container element
 * @returns {void}
 */
function handlePasswordInput(inputId, iconContainerId) {
    const passwordInput = document.getElementById(inputId);
    const iconContainer = document.getElementById(iconContainerId);
    const value = passwordInput.value.trim();
    if (value !== '') {
        if (passwordInput.type === 'text') {
            iconContainer.innerHTML = passwordVisibilityOnTemplate(iconContainerId, inputId);
        } else {
            iconContainer.innerHTML = passwordVisibilityOffTemplate(iconContainerId, inputId);
        }
    } else {
        iconContainer.innerHTML = defaultLockIconTemplate();
    };
};


/**
 * Toggles the visibility of the password input field.
 *
 * Switches the input type between "password" and "text" and updates the icon
 * to reflect the current visibility state.
 *
 * @param {string} iconContainerId - The ID of the icon container element
 * @param {string} inputId - The ID of the password input field
 * @returns {void}
 */
function togglePasswordVisibility(iconContainerId, inputId) {
    const passwordInput = document.getElementById(inputId);
    const iconContainer = document.getElementById(iconContainerId);
    passwordInput.setAttribute('type', passwordInput.getAttribute('type') === 'password' ? 'text' : 'password');
    if (passwordInput.type === 'text') {
        iconContainer.innerHTML = passwordVisibilityOnTemplate(iconContainerId, inputId);
    } else {
        iconContainer.innerHTML = passwordVisibilityOffTemplate(iconContainerId, inputId);
    };
};