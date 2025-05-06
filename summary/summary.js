const mainContainer = document.getElementById("navbar_container");
const greetingContainer = document.getElementById("summary_greating_container");

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
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

function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProfileButton = document.querySelector('.user_profile');
    
    // Wähle eine zufällige Farbe zwischen 1 und 20
    const randomColorNumber = Math.floor(Math.random() * 20) + 1;
    const randomColor = `var(--profile-color-${randomColorNumber})`;
    
    if (currentUser && currentUser.name) {
        const nameParts = currentUser.name.split(' ');
        const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
        userProfileButton.textContent = initials;
    } else {
        userProfileButton.textContent = 'G';  // G für Gast
    }
    
    // Setze die zufällige Farbe als Hintergrund
    userProfileButton.style.setProperty('--current-profile-color', randomColor);
}

window.onload = function() {
    // Sicherstellen, dass ein Benutzer eingeloggt ist
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }

    renderSidebar();
    updateGreeting();
    updateUserProfile();
    
    // Gast-Hinweis anzeigen
    if (currentUser.isGuest) {
        showNotification('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
    }
};

// Firebase zugriffe

const BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchTasks() {
    try {
        const response = await fetch(`${BASE_URL}/addtask.json`);
        const data = await response.json();
        return data ? Object.values(data) : [];
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
        totalTasks: tasks.length,
        inProgress: 0,
        awaitingFeedback: 0
    };

    let earliestDeadline = null;

    tasks.forEach(task => {
        // To-Do und Done
        const subtasksDone = task.Subtasks ? task.Subtasks.filter(st => st.status).length : 0;
        const totalSubtasks = task.Subtasks ? task.Subtasks.length : 0;
        
        if (totalSubtasks > 0) {
            if (subtasksDone === totalSubtasks) {
                stats.done++;
            } else {
                stats.todo++;
            }
        } else {
            stats.todo++;
        }

        // Nur Urgent Tasks zählen
        if (task.Priority && task.Priority.toLowerCase() === 'urgent') {
            stats.urgent++;
        }

        // Upcoming Deadline (unabhängig von Priority)
        if (task.DueDate) {
            const dueDate = parseDate(task.DueDate);
            if (!earliestDeadline || dueDate < earliestDeadline) {
                earliestDeadline = dueDate;
            }
        }

        // In Progress
        if (totalSubtasks > 0 && subtasksDone > 0 && subtasksDone < totalSubtasks) {
            stats.inProgress++;
        }

        // Awaiting Feedback
        if (task.Category === 'Feedback') {
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

function getPriorityIcon(priority) {
    if (priority === 'urgent') {
        return '../assets/imgs/add_task_btn_img/priority_btn_urgent_white.svg';
    } else if (priority === 'medium') {
        return '../assets/imgs/add_task_btn_img/priority_btn_medium_active_yellow.svg';
    } else {
        return '../assets/imgs/add_task_btn_img/priority_btn_low_active_white.svg';
    }
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
            <img src="${getPriorityIcon('urgent')}" alt="priority icon" class="priority-icon">
        </div>
        <div class="summary_column">
            <span class="summary_number">${stats.urgent}</span>
            <span class="summary_text">Urgent</span>
        </div>
    `;
    
    const deadlineText = stats.upcomingDeadline ? formatDate(stats.upcomingDeadline) : 'No deadlines';
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

window.onload = async function() {
    // Sicherstellen, dass ein Benutzer eingeloggt ist
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }

    renderSidebar();
    updateGreeting();
    updateUserProfile();
    
    // Gast-Hinweis anzeigen
    if (currentUser.isGuest) {
        showNotification('Sie nutzen die App im Gast-Modus mit eingeschränkten Funktionen');
    }

    // Daten laden und UI aktualisieren
    const tasks = await fetchTasks();
    const stats = calculateTaskStats(tasks);
    updateSummaryUI(stats);
};

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}