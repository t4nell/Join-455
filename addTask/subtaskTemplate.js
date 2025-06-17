/**
 * Generates the HTML template for the standard plus button in subtasks.
 *
 * @returns {string} HTML string for the plus button in the subtasks area.
 */
function resetButtonsTemplate() {
    return `
    <button class="plus_btn" onclick="replaceButtons()">
            <img
                class="subtasks_icon arrow_bg_hover_color_subtask"
                src="../assets/imgs//addTaskIcons/subtasksPlusIcon.svg"
                alt="New Button Icon" />
    </button>
    `;
}

/**
 * Generates the HTML template for the confirmation and cancel buttons in subtask input.
 *
 * @returns {string} HTML string with confirmation and cancel buttons.
 */
function getBtnsTemplate() {
    return `
    <button class="delete_text_btn" onclick="deleteTextBtn()">
        <img
            class="subtasks_icon arrow_bg_hover_color_subtask"
            id=""
            src="../assets/imgs/addTaskIcons/subtasksCancelIconAndClearTask.svg"
            alt="Icon" />
    </button>
    <hr class="separator_vertically_subtasks" />
    <button type="button" class="confirm_btn" onclick="checkValue()">
        <img
            class="subtasks_icon arrow_bg_hover_color_subtask"
            id=""
            src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
            alt="Icon" />
    </button>
        `;
}

/**
 * Generates the HTML template for delete and confirmation buttons when editing a subtask.
 *
 * @param {string} tagBtnConId - ID of the button container.
 * @param {string} tagInputId - ID of the input field.
 * @param {string} tagId - ID of the subtask element.
 * @returns {string} HTML string with delete and confirmation buttons.
 */
function newTagTrashDoneBtnTemplate(tagBtnConId, tagInputId, tagId) {
    return ` 
    <div class="btns_position_done_trash">
            <button class="edit_text_btn" onclick="trashBtn('${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon" />
            </button>
            <hr class="separator_vertically_subtasks" />
            <button class="done_btn" onclick="newTagCheckValue(event,'${tagBtnConId}', '${tagInputId}', '${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg" alt="Icon" />
            </button>
    </div>
    `;
}

/**
 * Generates the HTML template for the default buttons (edit and delete) for a subtask.
 *
 * @param {string} tagBtnConId - ID of the button container.
 * @param {string} tagInputId - ID of the input field.
 * @param {string} tagId - ID of the subtask element.
 * @returns {string} HTML string with edit and delete buttons.
 */
function newTagDefaultBtnsTemplate(tagBtnConId, tagInputId, tagId) {
    return `
    <div class="btns_position">
            <button class="edit_text_btn" onclick="editTextBtn(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon" />
            </button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="trashBtn('${tagId}')">
                <img class="subtasks_icon" id="" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon" />
            </button>
    </div>
    `;
}

/**
 * Generates the HTML template for a new subtask.
 *
 * @param {string} value - The text of the subtask.
 * @param {string} tagId - ID for the entire subtask element.
 * @param {string} tagInputId - ID for the input field.
 * @param {string} tagBtnConId - ID for the button container.
 * @returns {string} HTML string of the complete subtask element with text and buttons.
 */
function getNewTagTemplate(value, tagId, tagInputId, tagBtnConId) {
    return `
    <div class="tag_field" id="${tagId}">
            <textarea rows="1" name="subtasks" class="new_tag_input" id="${tagInputId}" 
                ondblclick="enableEditing('${tagInputId}', '${tagBtnConId}', '${tagId}')"
                onblur="disableEditing('${tagInputId}')"
                oninput="autoResizeTextarea(this)"
                readonly>${value}</textarea>
                
            <div id="${tagBtnConId}">
                <div class="btns_position">
                    <button
                        class="edit_text_btn"
                        onclick="editTextBtn(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')">
                        <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg" alt="Icon" />
                    </button>
                    <hr class="separator_vertically_subtasks" />
                    <button class="trash_btn" onclick="trashBtn('${tagId}')">
                        <img class="subtasks_icon" src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg" alt="Icon" />
                    </button>
                </div>
            </div>
    </div>
    `;
}

