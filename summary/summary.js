let globalStats = null;

/**
 * checks if a user is authenticated
 * 
 * @returns {Object|null} User object from localStorage or null if not found
 */
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return null;
    }
    return currentUser;
};


/**
 * Main initialization function - called by onload
 */
function init() {
    initializeGlobalStats();
    setupAllHandlers();
    const currentUser = checkAuth();
    initSidebar()
    renderHeader();
    updateUserProfile();
    updateGreeting();
    if (currentUser.isGuest) {
        showNotification('You are using the app in guest mode with limited functions');
    }
    loadAndRenderTasks();
};


/**
 * Initializes global statistics object
 */
function initializeGlobalStats() {
    if (typeof createStatsObject === 'function') {
        globalStats = createStatsObject();
    }
};


/**
 * Sets up all event handlers
 */
function setupAllHandlers() {
    setupTaskHandlers();
    setupFormHandlers();
    setupModalHandlers();
};


/**
 * Loads task data and renders the board
 */
function loadAndRenderTasks() {
    loadTaskData()
        .then(handleTaskDataLoaded)
        .catch(showLoadingError);
};


/**
 * Handles successful task data loading
 * 
 * @param {Object} stats - Task statistics
 */
function handleTaskDataLoaded(stats) {
    globalStats = stats;
    makeContainersClickable();
    if (typeof window.showMobileGreeting === 'function') {
        window.showMobileGreeting();
    }
};


/**
 * Shows error when loading task data fails
 * 
 */
function showLoadingError() {
    showNotification('Error loading tasks');
};


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
};


/**
 * Sets up form-related event handlers
 */
function setupFormHandlers() {
    window.handleFormSubmit = function(event) {
        if (event) event.preventDefault();
        saveFormData();
    };
};


/**
 * Sets up modal-related event handlers
 */
function setupModalHandlers() {
    window.handleModalClose = function() {
        const modal = document.getElementById('task_modal');
        if (modal) modal.classList.remove('open');
    };
};


/**
 * Renders the desktop version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for desktop view.
 */
function renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer) {
    navbarMobileContainer.innerHTML = '';
    mainContainer.innerHTML = getSidebarTemplate();
    navContainer.style.display = 'block';
}

/**
 * Renders the mobile version of the sidebar.
 *
 * @param {HTMLElement} mainContainer - Main container for the sidebar.
 * @param {HTMLElement} navContainer - Navigation container element.
 * @param {HTMLElement} navbarMobileContainer - Mobile navigation container element.
 * @returns {void} Updates the sidebar for mobile view.
 */
function renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer) {
    const currentPage = window.location.pathname;
    mainContainer.innerHTML = '';
    navbarMobileContainer.innerHTML = getSidebarTemplateMobile(currentPage);
    navContainer.style.display = 'none';
}

/**
 * Initializes the sidebar with event listeners and correct display.
 *
 * @returns {void} Sets up the sidebar responsiveness.
 */
function initSidebar() {
    const mediaQuery = window.matchMedia('(min-width: 1051px)');
    const handleBreakpoint = (placeholder) => {
        proofSize();
    };
    mediaQuery.addEventListener('change', handleBreakpoint);
    proofSize();
}

/**
 * Checks the window size and renders the appropriate sidebar version.
 *
 * @returns {void} Updates the sidebar based on screen width.
 */
function proofSize() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');
    const width = window.innerWidth;
    if (width < 1051) {
        renderSidebarMobile(mainContainer, navContainer, navbarMobileContainer);
    } else {
        renderSidebarDesktop(mainContainer, navContainer, navbarMobileContainer);
    }
}