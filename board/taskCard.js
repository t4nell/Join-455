const CATEGORY_COLORS = {
    'User Story': '#FF7A00',        // Orange
    'Technical Task': '#1FD7C1',    // Türkis
    'To Do': '#FC71FF',             // Pink
    'Backlog': '#6E52FF',           // Violett
    'Design': '#FF5EB3',            // Rosa
    'In Progress': '#00BEE8',       // Hellblau
    'In Review': '#9327FF',         // Lila
    'Blocked': '#FF745E',           // Rot
    'Testing': '#FFA35E',           // Hellorange
    'Done': '#2AD300',              // Grün
    'Archived': '#787878'           // Grau
};


function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || '#0052ff';
};


function toggleSectionButton() {
    const sectionButtons = document.querySelectorAll('#section_button_container')
    sectionButtons.forEach(button => {
        if (window.innerWidth < 1345) {
            button.style.display = 'flex'; 
        }else {
            button.style.display = 'none';
        };
    });
};


function renderSwapStatusTemplate(event) {
    event.stopPropagation();
    const existingTemplate = document.querySelector('.swap_status_template');
    if (existingTemplate) {
        existingTemplate.remove();
    };
    const taskCard = event.target.closest('.task_card');
    if (!taskCard) return;
    const swapStatusDiv = document.createElement('div');
    swapStatusDiv.innerHTML = getSwapStatusTemplate();
    const templateElement = swapStatusDiv.firstElementChild;
    taskCard.insertBefore(templateElement, taskCard.firstChild);
    addCloseSwapStatusListener(templateElement);
};


function addCloseSwapStatusListener(templateElement) {
    document.addEventListener('click', function closeSwapStatus(e) {
        if (!templateElement.contains(e.target) && !e.target.closest('#section_button')) {
            templateElement.remove();
            document.removeEventListener('click', closeSwapStatus);
        };
    });
};


function renderAssignedAvatars(assignedTo) {
    if (!assignedTo) return '';
    const maxVisibleAvatars = 5;
    const assignedContacts = getAssignedContacts(assignedTo);
    let avatarHtml = assignedContacts
        .slice(0, maxVisibleAvatars)
        .map(contact => getAvatarTemplate(contact)).join('');
    if (assignedContacts.length > maxVisibleAvatars) {
        avatarHtml += renderMoreAvatarsButton(assignedContacts.length, maxVisibleAvatars);
    }
    return avatarHtml;
};


function getAssignedContacts(assignedTo) {
    return Object.entries(assignedTo)
        .map(([contactId, isAssigned]) => {
            if (!isAssigned) return null;
            const contact = contactsArray.find(c => c.id === contactId);
            if (!contact) return null;
            return createBatch(contact, contactId);
        })
        .filter(contact => contact !== null);
};

    
function createBatch(contact, contactId) {
    const nameInitials = contact.name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    const surnameInitials = contact.surname
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    const initials = nameInitials + surnameInitials;
    return {
        id: contactId,
        initials,
        color: contact.color
    };
};


function calculateSubtaskProgress(task) {
    const subtasks = task.subtasks || {};
    const totalSubtasks = Object.keys(subtasks).length;
    const completedSubtasks = Object.values(subtasks).filter(subtask => subtask.done).length;
    return {
        total: totalSubtasks,
        completed: completedSubtasks,
        progressPercentage: totalSubtasks ? (completedSubtasks/totalSubtasks * 100) : 0
    };
};