let globalStats = null;

/**
 * checks if a user is authenticated
 * @returns {Object|null} User object from localStorage or null if not found
 */
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return null;
    }
    return currentUser;
}

/**
 * Main initialization function - called by onload
 */
function init() {
    
    initializeGlobalStats();
    setupAllHandlers();
    
    const currentUser = checkAuth();
    renderSidebar();
    renderHeader();
    updateUserProfile();
    updateGreeting();

    if (currentUser.isGuest) {
        showNotification('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
    }
    loadAndRenderTasks();
}

/**
 * Initializes global statistics object
 */
function initializeGlobalStats() {
    if (typeof createStatsObject === 'function') {
        globalStats = createStatsObject();
    }
}

/**
 * Sets up all event handlers
 */
function setupAllHandlers() {
    setupTaskHandlers();
    setupFormHandlers();
    setupModalHandlers();
}

/**
 * Loads task data and renders the board
 */
function loadAndRenderTasks() {
    loadTaskData()
        .then(handleTaskDataLoaded)
        .catch(showLoadingError);
}

/**
 * Handles successful task data loading
 * @param {Object} stats - Task statistics
 */
function handleTaskDataLoaded(stats) {
    globalStats = stats;
    makeContainersClickable();
    if (typeof window.showMobileGreeting === 'function') {
        window.showMobileGreeting();
    }
}

/**
 * Shows error when loading task data fails
 */
function showLoadingError() {
    showNotification('Error loading tasks');
}

/**
 * Sets up task-related event handlers
 */
function setupTaskHandlers() {
    window.handleTaskDelete = function(taskId) {
        deleteTaskById(taskId);
    };
    
    window.handleTaskEdit = function(taskId) {
        openTaskModal('edit', taskId);
    };
}

/**
 * Sets up form-related event handlers
 */
function setupFormHandlers() {
    window.handleFormSubmit = function(event) {
        if (event) event.preventDefault();
        saveFormData();
    };
}

/**
 * Sets up modal-related event handlers
 */
function setupModalHandlers() {
    window.handleModalClose = function() {
        const modal = document.getElementById('task_modal');
        if (modal) modal.classList.remove('open');
    };
}

/**
 * Shows the correct sidebar depending on screen size.
 * Desktop: shows full sidebar.
 * Mobile: shows mobile sidebar.
 */
function renderSidebar() {
    const main = document.getElementById('navbar_container');
    const side = document.getElementById('sidebar_container');
    const mobile = document.getElementById('navbar_mobile_container');

    window.addEventListener('resize', () => {updateSidebar(main, side, mobile)});
    updateSidebar(main, side, mobile);
}

function updateSidebar(main, side, mobile) {
    const currentPage = window.location.pathname;
    const isMobile = window.innerWidth < 1050;
    main.innerHTML = isMobile ? '' : getSidebarTemplate();
    mobile.innerHTML = isMobile ? getSidebarTemplateMobile(currentPage) : '';
    side.style.display = isMobile ? 'none' : 'block';
}