const BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/"
const mainContainer = document.getElementById("navbar_container");
const headerContainer = document.getElementById('header_container');
const overlay = document.getElementById("overlay_background_container");
const taskDetailCard = document.getElementById("task_detail_card");
const dragAreaTodo = document.getElementById("drag_area_todo");
const dragAreaInProgress = document.getElementById("drag_area_in_progress");
const dragAreaAwaitFeedback = document.getElementById("drag_area_await_feedback");
const dragAreaDone = document.getElementById("drag_area_done");
const allTasks = [];

async function init() {
    renderContent()
    updateUserProfile();
    await loadAddTask();
    renderTaskCardTodo();
};

/**
 * Zeigt die nav und denn Header
 * 
*/
function renderContent() {
    mainContainer.innerHTML += getSidebarTemplate();
    headerContainer.innerHTML = getHeaderTemplate();
};

async function loadAddTask(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    const addTaskData = responseToJson.addTask;
    allTasks.length = 0;
    allTasks.push(...Object.values(addTaskData));
}

function renderTaskCardTodo() {
    const todos = allTasks.filter(task => task.status === 'todo');
    dragAreaTodo.innerHTML = '';
    if (todos.length === 0) {
        dragAreaTodo.innerHTML = '<span class="drag_area_placeholder">No Task Todo</span>';
        return;
    }
    todos.forEach(task => {
        dragAreaTodo.innerHTML += getTaskCard(task);
    });
};

/**
 * Zeigt das Task-Detail Template an
 * 
 */
function renderDetailTemplate() {
    overlay.classList.remove("fade_out");
    taskDetailCard.classList.remove("closed");
};

/**
 * Schließt das Task-Detail Template
 * 
 */
function closeDetailTemplate() {
    overlay.classList.add("fade_out");
    taskDetailCard.classList.add("closed");
};

/**
 * Verhindert das Schließen beim Klick auf die Karte
 * 
 */
function eventBubbling(event) {
    event.stopPropagation();
};


// window.onload = async function() {
//     try {
//         const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//         if (!currentUser) {
//             window.location.href = '../index.html';
//             return;
//         }

//           renderSidebar()
//           renderHeader()
//           updateUserProfile()
//     } catch (error) {
//         console.error("Error initializing board:", error);
//     }
// };
