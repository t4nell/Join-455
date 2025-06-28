const searchInput = document.getElementById('search_input');
const searchContainer = document.getElementById('search_container');
const searchButton = document.getElementById('search_button')
const searchIcon = searchButton.querySelector('img');
let isSearchActive = false;


/**
 * Handles search functionality for tasks based on user input
 * 
 * @returns {void} Updates task display based on search criteria
 */
function searchOnInput() {
    const searchValue = searchInput.value.toLowerCase();
    const noTaskMessage = document.getElementById('no_find_task_mesage');
    toggleSearchIcon(searchValue);
    if (searchValue.length === 0) {
        resetFilter();
        noTaskMessage.style.display = 'none';
        return;
    };
    const filteredTasks = getFilteredTasks(searchValue, noTaskMessage);
    renderFilteredColumns(filteredTasks);
};


/**
 * Toggles the search icon between search and close depending on input state.
 *
 * @param {string} searchValue - Current value of the search input
 * @returns {void} Updates the search icon and state
 */
function toggleSearchIcon(searchValue) {
    if (!isSearchActive && searchValue.length > 0) {
        isSearchActive = true;
        searchIcon.src = '../assets/imgs/boardIcons/close.svg';
    };
};


/**
 * Filters tasks based on search value
 * 
 * @param {string} searchValue - Lowercase search term to filter by
 * @param {HTMLElement} noTaskMessage - Element to show when no tasks match
 * @returns {Array} Filtered array of tasks matching search criteria
 */
function getFilteredTasks(searchValue, noTaskMessage) {
    const filteredTasks = allTasks.filter(task => task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue)
    );
    if (filteredTasks.length === 0) {
        noTaskMessage.style.display = 'block';
    } else {
        noTaskMessage.style.display = 'none';
    };
    return filteredTasks;
};


/**
 * Resets search filter and restores original task display
 * 
 * @returns {void} Clears search and resets task display
 */
function resetFilter() {
    if (isSearchActive) {
        isSearchActive = false;
        searchIcon.src = '../assets/imgs/boardIcons/search.svg';
        searchInput.value = '';
        const noTaskMessage = document.getElementById('no_find_task_mesage');
        noTaskMessage.style.display = 'none';
        renderColumns();
    }
};


/**
 * Renders task columns with filtered results
 * 
 * @param {Array} filteredTasks - Array of tasks that match search criteria
 * @returns {void} Updates columns with filtered task cards
 */
function renderFilteredColumns(filteredTasks) {
    dragAreaTodo.innerHTML = '';
    dragAreaInProgress.innerHTML = '';
    dragAreaAwaitFeedback.innerHTML = '';  
    dragAreaDone.innerHTML = '';
    renderAllTaskCards(filteredTasks, "todo", dragAreaTodo);
    renderAllTaskCards(filteredTasks, "inProgress", dragAreaInProgress);
    renderAllTaskCards(filteredTasks, "awaitFeedback", dragAreaAwaitFeedback);
    renderAllTaskCards(filteredTasks, "done", dragAreaDone);
};