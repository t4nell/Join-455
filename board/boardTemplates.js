function renderPlaceholder() {
  return `
  <span class="drag_area_placeholder">No Tasks</span>
  ` 
};


function getTaskCard(task) {
  const progress = calculateSubtaskProgress(task);
  const categoryColor = getCategoryColor(task.category);
  return `
    <div draggable="true" ondragstart="startDragging(event, '${task.id}')" id="task_${task.id}" class="task_card" onclick="renderDetailTemplate('${task.id}')">
      <div class="task_category">
        <span class="category_label" style="background-color: ${categoryColor}">${task.category}</span>
      </div>
      <div class="task_content">
          <h3 class="task_title">${task.title}</h3>
          <p class="task_description">${task.description}</p>
      </div>
      <div class="progress_section" style="${progress.total === 0 ? 'display:none' : ''}">
        <div class="progress_bar">
          <div class="progress_fill" style="width: ${progress.progressPercentage}%; background-color: ${progress.completed === progress.total ? 'var(--progress-fill-full-color)' : 'var(--progress-fill-color)'}"></div>
        </div>
        <span class="subtask_counter">${progress.completed}/${progress.total} Subtasks</span>
      </div>
      <div class="task_footer">
        <div class="assignee_avatars">
          ${renderAssignedAvatars(task.assignedTo)}
        </div>
        <div class="menu_priority">
          <img src="../assets/imgs/boardIcons/priority${task.priority}.svg" alt="${task.priority}">
        </div>
      </div>
    </div>
  `
};


function getDetailTaskCard(task) {
  const categoryColor = getCategoryColor(task.category);
    return `
        <div class="task_detail_card_header">
          <span class="category_lable_detail" style="background-color: ${categoryColor}">${task.category}</span>
          <button onclick="closeDetailTemplate()" class="closed_btn">
            <img src="../assets/imgs/boardIcons/close.svg" alt="close button">
          </button>
        </div>

        <div class="task_detail_title">
          <h2>${task.title}</h2>
        </div>

        <div class="task_detail_description">
          <p>${task.description}</p>
        </div>

        <div class="task_detail_date">
          <span class="detail_label">Due Date:</span>
          <span>${task.dueDate}</span>
        </div>

        <div class="task_detail_priority">
          <span class="detail_label">Priority:</span>
          <div class="priority_badge">
            ${task.priority}
            <img src="../assets/imgs/boardIcons/priority${task.priority}.svg" alt="${task.priority}">
          </div>
        </div>

        <div class="task_detail_assigned">
          <span class="detail_label">Assigned to:</span>
          <div class="assigned_contacts">
            ${renderAssignedContacts(task.assignedTo)}
          </div>
        </div>

        <div class="task_detail_subtasks">
          <span class="detail_label">Subtasks:</span>
          <div class="subtasks_list">
            ${renderSubtasksList(task.subtasks, task.id)}
          </div>
        </div>

        <div class="task_detail_buttons">
          <button class="delete_btn" onclick="deleteTask('${task.id}')">
            <img src="../assets/imgs/boardIcons/delete.svg" alt="delete">
            Delete
          </button>
          <button class="edit_btn" onclick="openEditTask('${task.id}')">
            <img src="../assets/imgs/boardIcons/edit.svg" alt="edit">
            Edit
          </button>
        </div>
    `;
};


