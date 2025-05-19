const BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/"
const mainContainer = document.getElementById("navbar_container");
const headerContainer = document.getElementById('header_container');
const overlay = document.getElementById("overlay_background_container");
const taskDetailCard = document.getElementById("task_detail_card");
const dragAreaTodo = document.getElementById("drag_area_todo");
const dragAreaInProgress = document.getElementById("drag_area_in_progress");
const dragAreaAwaitFeedback = document.getElementById("drag_area_await_feedback");
const dragAreaDone = document.getElementById("drag_area_done");
let allTasks = [];
let contactsArray = [];

async function init() {
    renderContent();
    updateUserProfile();
    await loadContactData();
    await loadAddTask();
    initTaskTemplate();
    renderColumns();
    loadContactsToAssigned();
};

async function loadContactData(path = '') {
    try {
        let response = await fetch(BASE_URL + path + '.json');
        let responseToJson = await response.json();
        const contactsRef = responseToJson.contact;
        const addTask = Object.values(responseToJson.addTask);
        contactsArray = Object.values(contactsRef);
        contactsArray = contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
    loadContactsToAssigned();
}

/**
 * Rendert die nav und denn Header
 * 
*/
function renderContent() {
    mainContainer.innerHTML += getSidebarTemplate();
    headerContainer.innerHTML += getHeaderTemplate();
};

async function loadAddTask(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    const addTaskData = responseToJson.addTask;
    allTasks = Object.entries(addTaskData).map(([id, task]) => ({
        ...task,
        id
    }));    
};

function renderAllTaskCards(allTasks, state, id) {
    const todos = allTasks.filter(task => task.status === state);
    id.innerHTML = '';
    if (todos.length === 0) {
        id.innerHTML = renderPlaceholder();
        return;
    }
    todos.forEach(task => {
        id.innerHTML += getTaskCard(task);
    });
};

function renderColumns() {
    renderAllTaskCards(allTasks, "todo", dragAreaTodo);
    renderAllTaskCards(allTasks, "inProgress", dragAreaInProgress);
    renderAllTaskCards(allTasks, "awaitFeedback", dragAreaAwaitFeedback);
    renderAllTaskCards(allTasks, "done", dragAreaDone);
};