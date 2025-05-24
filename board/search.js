const searchInput = document.getElementById('search_input');
const searchContainer = document.getElementById('search_container');
const searchButton = document.getElementById('search_button')
const searchIcon = searchButton.querySelector('img');
let isSearchActive = false;

/**
 * Search tasks by title or description when search button is clicked
 */
function searchTasks() {
    const searchValue = searchInput.value.toLowerCase();
    if (!isSearchActive) {
        if (searchValue.length === 0) return;
        // Aktiviere Suche
        isSearchActive = true;
        searchIcon.src = '../assets/imgs/boardIcons/close.svg';
        const filteredTasks = allTasks.filter(task => 
            task.title.toLowerCase().includes(searchValue) || 
            task.description.toLowerCase().includes(searchValue)
        );
        renderFilteredColumns(filteredTasks);
    } else {
        // Reset Suche
        isSearchActive = false;
        searchIcon.src = '../assets/imgs/boardIcons/search.svg';
        searchInput.value = '';
        renderColumns();
    };
};


/**
 * Render columns with filtered tasks
 * 
 * @param {Array} filteredTasks 
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