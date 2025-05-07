const mainContainer = document.getElementById("navbar_container");
const overlay = document.getElementById("overlay_background_container");
const taskDetailCard = document.getElementById("task_detail_card");
const dragAreaTodo = document.getElementById("drag_area_todo");
const dragAreaInProgress = document.getElementById("drag_area_in_progress");
const dragAreaAwaitFeedback = document.getElementById("drag_area_await_feedback");
const dragAreaDone = document.getElementById("drag_area_done");

function init() {
    renderSidebar()
    renderTaskCard()
}

/**
 * Zeigt die nav der sidebar
 * 
 */
function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

function renderTaskCard() {
    dragAreaTodo.innerHTML = getTaskCard();
}

/**
 * Zeigt das Task-Detail Template an
 * 
 */
function renderDetailTemplate() {
    overlay.classList.remove("fade_out");
    taskDetailCard.classList.remove("closed");
}

/**
 * Schließt das Task-Detail Template
 * 
 */
function closeDetailTemplate() {
    overlay.classList.add("fade_out");
    taskDetailCard.classList.add("closed");
}

/**
 * Verhindert das Schließen beim Klick auf die Karte
 * 
 */
function eventBubbling(event) {
    event.stopPropagation();
}