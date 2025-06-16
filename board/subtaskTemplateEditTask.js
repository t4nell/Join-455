function resetButtonsTemplateEditTask() {
    return `
    <button class="plus_btn" onclick="replaceButtonsEditTask()">
            <img
                class="subtasks_icon arrow_bg_hover_color_subtask"
                src="../assets/imgs//addTaskIcons/subtasksPlusIcon.svg"
                alt="New Button Icon" />
    </button>
    `;
}

function getBtnsTemplateEditTask() {
    return `
    <button class="delete_text_btn" onclick="deleteTextBtnEditTask()">
        <img
            class="subtasks_icon arrow_bg_hover_color_subtask"
            id=""
            src="../assets/imgs/addTaskIcons/subtasksCancelIconAndClearTask.svg"
            alt="Icon" />
    </button>
    <hr class="separator_vertically_subtasks" />
    <button type="button" class="confirm_btn" onclick="checkValueEditTask()">
        <img
            class="subtasks_icon arrow_bg_hover_color_subtask"
            id=""
            src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
            alt="Icon" />
    </button>
        `;
}

function newTagTrashDoneBtnTemplateEditTask(tagBtnConId, tagInputId, tagId) {
    return ` 
    <div class="btns_position_done_trash">
            <button class="edit_text_btn" onclick="trashBtnEditTask('${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon" />
            </button>
            <hr class="separator_vertically_subtasks" />
            <button class="done_btn" onclick="newTagCheckValueEditTask(event,'${tagBtnConId}', '${tagInputId}', '${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg" alt="Icon" />
            </button>
    </div>
    `;
}

function newTagDefaultBtnsTemplateEditTask(tagBtnConId, tagInputId, tagId) {
    return `
    <div class="btns_position">
            <button class="edit_text_btn" onclick="editTextBtnEditTask(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon" />
            </button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="trashBtnEditTask('${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon" />
            </button>
    </div>
    `;
}

function getNewTagTemplateEditTask(value, tagId, tagInputId, tagBtnConId) {
    return `
    <div class="tag_field" id="${tagId}">
            <textarea rows="1" name="subtasks" class="new_tag_input" id="${tagInputId}" 
                ondblclick="enableEditingEditTask('${tagInputId}', '${tagBtnConId}', '${tagId}')"
                onblur="disableEditingEditTask('${tagInputId}')"
                oninput="autoResizeTextareaEditTask(this)"
                readonly>${value}</textarea>
                
            <div id="${tagBtnConId}">
                <div class="btns_position">
                    <button
                        class="edit_text_btn"
                        onclick="editTextBtnEditTask(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                        <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon" />
                    </button>
                    <hr class="separator_vertically_subtasks" />
                    <button class="trash_btn" onclick="trashBtnEditTask('${tagId}')">
                        <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon" />
                    </button>
                </div>
            </div>
    </div>
    `;
}

