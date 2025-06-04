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

function newTagTrashDoneBtnTemplate(tagBtnConId, tagInputId, tagId) {
    return ` 
    <div class="btns_position_two">
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

