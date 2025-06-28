/**
 * Generates HTML template for default subtask buttons
 * 
 * @returns {string} HTML string containing default add button markup
 */
function resetButtonsTemplateEditTask() {
    return `
    <button class="plus_btn" onclick="replaceButtonsEditTask()">
            <img
                class="subtasks_icon arrow_bg_hover_color_subtask"
                src="../assets/imgs/addTaskIcons/subtasksPlusIcon.svg"
                alt="New Button Icon" />
    </button>
    `;
};


/**
 * Generates HTML template for subtask edit buttons
 * 
 * @returns {string} HTML string containing edit and confirm button markup
 */
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
};


/**
 * Generates HTML template for trash and done buttons
 * 
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagInputId - ID of input field
 * @param {string} tagId - ID of subtask element
 * @returns {string} HTML string containing trash and done button markup
 */
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
};


/**
 * Generates HTML template for default edit and trash buttons
 * 
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagInputId - ID of input field
 * @param {string} tagId - ID of subtask element
 * @returns {string} HTML string containing edit and trash button markup
 */
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
};


/**
 * Generates HTML template for new subtask element
 * 
 * @param {string} value - Text content of subtask
 * @param {string} tagId - ID for subtask container
 * @param {string} tagInputId - ID for textarea element
 * @param {string} tagBtnConId - ID for button container
 * @returns {string} HTML string containing complete subtask element markup
 */
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
};