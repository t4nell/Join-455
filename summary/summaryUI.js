/**
 * @fileoverview UI-related functions for the summary page
 */

/**
 * Returns appropriate greeting based on time of day
 * @param {number} hours - Current hour (0-23)
 * @returns {string} Appropriate greeting message
 */
function getGreeting(hours) {
    if (hours >= 0 && hours < 10) {
        return 'Guten Morgen';
    } else if (hours >= 10 && hours < 19) {
        return 'Guten Tag';
    } else {
        return 'Guten Abend';
    }
}

/**
 * Updates the greeting with current user's name
 * Uses getGreeting function to determine appropriate greeting based on time of day
 * @returns {void}
 */
function updateGreeting() {
    const now = new Date();
    const greeting = getGreeting(now.getHours());
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.name || 'Gast';

    const greetingContainer = document.getElementById('summary_greating_container');
    if (greetingContainer) {
        greetingContainer.innerHTML = `
            <h1>${greeting},</h1>
            <h2>${userName}</h2>
        `;
    }
}

/**
 * Shows a fullscreen greeting that fades out after a few seconds on mobile devices
 * Only shown on first visit per session and only on mobile devices (width < 1050px)
 * @returns {void}
 */
function showMobileGreeting() {
    const hasSeenGreeting = sessionStorage.getItem('hasSeenGreeting');
    
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1050 || hasSeenGreeting === 'true') {
        return;
    }
    
    sessionStorage.setItem('hasSeenGreeting', 'true');
    
    const now = new Date();
    const greeting = getGreeting(now.getHours());
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.name || 'Gast';
    
    const fullscreenGreeting = document.createElement('div');
    fullscreenGreeting.className = 'fullscreen-greeting';
    fullscreenGreeting.innerHTML = `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
    
    const summaryContainer = document.querySelector('.summary_container');
    summaryContainer.classList.add('summary-content-hidden');
    
    document.body.appendChild(fullscreenGreeting);
    
    setTimeout(() => {
        fullscreenGreeting.classList.add('hidden');
        
        setTimeout(() => {
            summaryContainer.classList.remove('summary-content-hidden');
            summaryContainer.classList.add('summary-content-visible');
            
            setTimeout(() => {
                fullscreenGreeting.remove();
            }, 1000);
        }, 1000);
    }, 3000);
}

/**
 * Parses a date string into a Date object
 * @param {string} dateString - Date string in format "DD/MM/YYYY"
 * @returns {Date|null} Parsed Date object or null if input is invalid
 */
function parseDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Formats a Date object into a readable date string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "May 21, 2025")
 */
function formatDate(date) {
    if (!date) return 'No date';
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Shows a temporary notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}