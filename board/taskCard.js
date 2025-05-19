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

function renderAssignedAvatars(assignedTo) {
    if (!assignedTo) return '';
    const maxVisibleAvatars = 5;
    const assignedContacts = Object.entries(assignedTo)
        .filter(([_, isAssigned]) => isAssigned)
        .map(([name, _]) => {
            const initials = name
                .split(' ')
                .map(part => part.charAt(0).toUpperCase())
                .join('');
            return {
                name,
                initials,
                color: getContactColor(name)
            };
        });
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

function getContactColor(name) {
    const contacts = contactsArray.find(contact => 
        `${contact.name} ${contact.surname}` === name
    );
    return contacts ? contacts.color : '#0052ff';
};