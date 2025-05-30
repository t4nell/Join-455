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
}


function renderAssignedAvatars(assignedTo) {
    if (!assignedTo) return '';
    const maxVisibleAvatars = 5;
    
    const assignedContacts = Object.entries(assignedTo)
    .map(([id, contactMap]) => {
        const [[fullName, isAssigned]] = Object.entries(contactMap);
        
        if (!isAssigned) return null;
        
        const initials = fullName
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
        
        return {
            name: fullName,
            initials,
            color: getContactColor(fullName)
        };
    })
    .filter(contact => contact !== null);
    
    let avatarHtml = assignedContacts
    .slice(0, maxVisibleAvatars)
    .map(contact => `
        <div class="avatar" style="background-color: ${contact.color}">
        ${contact.initials}
        </div>
        `).join('');
        
        if (assignedContacts.length > maxVisibleAvatars) {
            avatarHtml += `
            <div class="avatar more-avatar">
            +${assignedContacts.length - maxVisibleAvatars}
            </div>
            `;
        }
        
        return avatarHtml;
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


function getContactColor(name) {
    const contacts = contactsArray.find(contact => 
        `${contact.name} ${contact.surname}` === name
    );
    return contacts ? contacts.color : '#0052ff';
};