const BASE_URL = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
const mainContainer = document.getElementById('navbar_container');
const headerContainer = document.getElementById('header_container');
const overlay = document.getElementById('overlay_background_container');
const taskDetailCard = document.getElementById('task_detail_card');
const dragAreaTodo = document.getElementById('drag_area_todo');
const dragAreaInProgress = document.getElementById('drag_area_in_progress');
const dragAreaAwaitFeedback = document.getElementById('drag_area_await_feedback');
const dragAreaDone = document.getElementById('drag_area_done');
let allTasks = [];

async function init() {
    renderSidebar();
    renderContent();
    updateUserProfile();
    await loadContactData();
    await loadAddTask();
    renderColumns();
    loadContactsToAssigned();
}

/**
 * Rendert die nav und denn Header
 *
 */
function renderContent() {
    // mainContainer.innerHTML += getSidebarTemplate();
    headerContainer.innerHTML += getHeaderTemplate();
}

async function loadAddTask(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    const addTaskData = responseToJson.addTask;
    allTasks = Object.entries(addTaskData).map(([id, task]) => ({
        ...task,
        id,
    }));
}

function renderColumns() {
    renderAllTaskCards(allTasks, 'todo', dragAreaTodo);
    renderAllTaskCards(allTasks, 'inProgress', dragAreaInProgress);
    renderAllTaskCards(allTasks, 'awaitFeedback', dragAreaAwaitFeedback);
    renderAllTaskCards(allTasks, 'done', dragAreaDone);
}

function renderAllTaskCards(allTasks, state, id) {
    const todos = allTasks.filter((task) => task.status === state);
    id.innerHTML = '';
    if (todos.length === 0) {
        id.innerHTML = renderPlaceholder();
        return;
    }
    todos.forEach((task) => {
        id.innerHTML += getTaskCard(task);
    });
}

console.log('----------------Mobile SideBar Template----------------------');

function getSidebarTemplateMobile() {
    const currentPage = window.location.pathname;
    return ` 
    <div class="sidebar_container">  
   <nav class="sidebar_nav">
  <a href="../summary/summary.html" class="nav_item ${currentPage.includes('summary') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/summary.svg" alt="Summary Icon">
    <span>Summary</span>
  </a>
   <a href="../board/board.html" class="nav_item ${currentPage.includes('board') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/board.svg" alt="Board Icon">
    <span>Board</span>
  </a>
  <a href="../addTask/addTask.html" class="nav_item ${currentPage.includes('addTask') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/addTask.svg" alt="Add Task Icon">
    <span>Add Task</span>
  </a>
 
  <a href="../contacts/contacts.html" class="nav_item ${currentPage.includes('contacts') ? 'active' : ''}">
    <img src="../assets/imgs/sidebarIcons/contacts.svg" alt="Contacts Icon">
    <span>Contacts</span>
  </a>
</nav>
</div>

  `;
}

console.log('----------------Mobile SideBar----------------------');

function renderSidebar() {
    const mainContainer = document.getElementById('navbar_container');
    const navContainer = document.getElementById('sidebar_container');
    const navbarMobileContainer = document.getElementById('navbar_mobile_container');

    function renderSidebarDesktop() {
        navbarMobileContainer.innerHTML = '';
        mainContainer.innerHTML = getSidebarTemplate();
        navContainer.style.display = 'block';
    }

    function renderSidebarMobile() {
        mainContainer.innerHTML = '';
        navbarMobileContainer.innerHTML = getSidebarTemplateMobile();
        navContainer.style.display = 'none';
    }

    function proofSize() {
        const width = window.innerWidth;
        if (width < 1050) {
            renderSidebarMobile();
        } else {
            renderSidebarDesktop();
        }
    }

    window.addEventListener('resize', proofSize);
    proofSize();
}

