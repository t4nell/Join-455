const searchInput = document.getElementById('search_input');
const searchContainer = document.getElementById('search_container');
const searchButton = document.getElementById('search_button')
const searchIcon = searchButton.querySelector('img');
let isSearchActive = false;


/**
 * Search tasks by title or description when search button is clicked and reset search when click again
 * 
 */
function searchOnInput() {
    const searchValue = searchInput.value.toLowerCase();
    const noTaskMessage = document.getElementById('no_find_task_mesage');

    if (!isSearchActive && searchValue.length > 0) {
        isSearchActive = true;
        searchIcon.src = '../assets/imgs/boardIcons/close.svg';
    }

    if (searchValue.length === 0) {
        resetFilter();
        noTaskMessage.style.display = 'none';
        return;
    }

    const filteredTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes(searchValue) || 
        task.description.toLowerCase().includes(searchValue)
    );

    if (filteredTasks.length === 0) {
        noTaskMessage.style.display = 'block';
    } else {
        noTaskMessage.style.display = 'none';
    }
    
    renderFilteredColumns(filteredTasks);
}

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