const mainContainer = document.getElementById("navbar_container");
const greetingContainer = document.getElementById("summary_greating_container");

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

function renderHeader() {
    const headerContainer = document.getElementById('header_container');
    headerContainer.innerHTML = getHeaderTemplate();
}

function updateGreeting() {
    const now = new Date();
    let greeting;
    const hours = now.getHours();
    
    if (hours >= 0 && hours < 10) {
        greeting = "Guten Morgen";
    } else if (hours >= 10 && hours < 19) {
        greeting = "Guten Tag";
    } else {
        greeting = "Guten Abend";
    }
    
   
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userName = currentUser?.name || 'Gast';
    
    greetingContainer.innerHTML = `
        <h1>${greeting},</h1>
        <h2>${userName}</h2>
    `;
}

window.onload = async function() {
    try {
        // Benutzer-Authentifizierung prüfen
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }

        // UI Initialisierung
        renderSidebar();
        renderHeader();
        updateUserProfile();
        updateGreeting();

        // Gast-Modus Hinweis
        if (currentUser.isGuest) {
            showNotification('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
        }

        // Daten laden und UI aktualisieren
        const tasks = await fetchTasks();
        const stats = calculateTaskStats(tasks);
        updateSummaryUI(stats);

    } catch (error) {
        console.error("Error initializing summary:", error);
        showNotification('Fehler beim Laden der Daten');
    }
};

// Firebase zugriffe
const BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchTasks() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return [];
        
        const response = await fetch(`${BASE_URL}addTask.json`);
        const data = await response.json();
        if (!data) return [];

        // Konvertiere die Tasks in das richtige Format
        const allTasks = Object.entries(data).map(([id, task]) => ({
            id,
            Category: task.Category,
            Title: task.Titel,
            Description: task.Description,
            DueDate: task.DueDate,
            Priority: task.Priority,
            status: task.status,
            Subtasks: task.Subtasks || [],
            AssignedTo: task.AssignedTo || []
        }));

        return allTasks.filter(task => task.status !== 'deleted');
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

function calculateTaskStats(tasks) {
    const stats = {
        todo: 0,
        done: 0,
        urgent: 0,
        upcomingDeadline: null,
        nextUrgentTask: null,
        totalTasks: tasks.length,
        inProgress: 0,
        awaitingFeedback: 0
    };

    let earliestDeadline = null;
    let nextUrgentDate = null;

    tasks.forEach(task => {
        // Zähle Tasks nach Status
        switch(task.status) {
            case 'todo':
                stats.todo++;
                break;
            case 'done':
                stats.done++;
                break;
            case 'inprogress':
                stats.inProgress++;
                break;
            case 'awaitfeedback':
                stats.awaitingFeedback++;
                break;
        }
        
        // Prüfe Subtasks
        const subtasksDone = task.Subtasks ? task.Subtasks.filter(st => st.status).length : 0;
        const totalSubtasks = task.Subtasks ? task.Subtasks.length : 0;
        
        if (totalSubtasks > 0 && subtasksDone > 0 && subtasksDone < totalSubtasks) {
            stats.inProgress++;
        }
        
        // Prioritätsprüfung und nächster dringender Task
        if (task.Priority && task.Priority.toLowerCase() === 'urgent') {
            stats.urgent++;
            const taskDate = task.DueDate ? parseDate(task.DueDate) : null;
            
            // Speichere den Task wenn er das früheste Datum hat oder noch kein dringender Task gefunden wurde
            if (taskDate && (!nextUrgentDate || taskDate < nextUrgentDate)) {
                nextUrgentDate = taskDate;
                stats.nextUrgentTask = task;
            }
        }

        // Allgemeines Fälligkeitsdatum
        if (task.DueDate) {
            const dueDate = parseDate(task.DueDate);
            if (!earliestDeadline || dueDate < earliestDeadline) {
                earliestDeadline = dueDate;
            }
        }

        // Feedback Status
        if (task.Category === 'Feedback' || task.status === 'awaitfeedback') {
            stats.awaitingFeedback++;
        }
    });

    stats.upcomingDeadline = earliestDeadline;
    return stats;
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function updateSummaryUI(stats) {
    // To-Do und Done
    const todoColumn = document.getElementById('summary_todo_container').querySelector('.summary_column');
    todoColumn.innerHTML = `
        <span class="summary_number">${stats.todo}</span>
        <span class="summary_text">To-do</span>
    `;

    const doneColumn = document.getElementById('summary_done_container').querySelector('.summary_column');
    doneColumn.innerHTML = `
        <span class="summary_number">${stats.done}</span>
        <span class="summary_text">Done</span>
    `;

    // Urgent und Deadline
    const urgentColumn = document.getElementById('summary_importance_container');
    urgentColumn.innerHTML = `
        <div class="priority-icon-container">
            <img src="../assets/imgs/addTaskIcons/priorityUrgentIconWhite.svg" alt="priority icon" class="priority-icon">
        </div>
        <div class="summary_column">
            <span class="summary_number">${stats.urgent}</span>
            <span class="summary_text">Urgent</span>
        </div>
    `;
    
    const deadlineText = stats.nextUrgentTask && stats.nextUrgentTask.DueDate 
        ? formatDate(parseDate(stats.nextUrgentTask.DueDate))
        : 'No urgent deadlines';
    const deadlineColumn = document.getElementById('summary_deadline_container');
    deadlineColumn.innerHTML = `
        <span class="summary_date">${deadlineText}</span>
        <span class="summary_text">Upcoming Deadline</span>
    `;

    // Board Stats
    const tasksColumn = document.getElementById('summary_tasks_board_container');
    tasksColumn.innerHTML = `
        <span class="summary_number">${stats.totalTasks}</span>
        <span class="summary_text">Tasks in Board</span>
    `;

    const progressColumn = document.getElementById('summary_tasks_progress_container');
    progressColumn.innerHTML = `
        <span class="summary_number">${stats.inProgress}</span>
        <span class="summary_text">Tasks In Progress</span>
    `;

    const feedbackColumn = document.getElementById('summary_await_feedback_container');
    feedbackColumn.innerHTML = `
        <span class="summary_number">${stats.awaitingFeedback}</span>
        <span class="summary_text">Awaiting Feedback</span>
    `;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}