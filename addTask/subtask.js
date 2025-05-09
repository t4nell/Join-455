function onKeyDownEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtn();
    }
}

function deletTextBtn() {
    const inputField = document.getElementById('tag_input_field');
    inputField.value = '';
    resetButtons();
}

function confirmSubtaskBtn() {
    const inputField = document.getElementById('tag_input_field');
    const value = inputField.value.trim();
    const newTagCon = document.getElementById('new_tag_container');
    if (value) {
        newTagCon.innerHTML += getNewTagTemplate(value);
        inputField.value = '';
        resetButtons();
    }
}

function resetButtons() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container');
    subtaskBtnContainer.innerHTML = `
        <button class="plus_btn" onclick="replaceButtons()">
            <img
                class="subtasks_icon arrow_bg_hover_color_subtask"
                src="../assets/imgs//addTaskIcons/subtasksPlusIcon.svg"
                alt="New Button Icon"
               />
        </button>
    `;
}

function trashBtn() {
    const newTagField = document.getElementById('tag_field');
    newTagField.remove();
}

function getNewTagTemplate(value) {
    return `
    <div class="tag_field" id='tag_field'>
    <span class="tag_prefix">・</span>
    <input name="subtasks" class="new_tag_input" id='new_tag_input' type="text" value="${value}" />
        <div class="btns_position" id='new_tag_btn_container'>
            <button class="edit_text_btn" onclick="editTextBtn()"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg"
                                        alt="Icon"
                                        /></button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="trashBtn()"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg"
                                        alt="Icon"
                                       /></button>
        </div>
    </div>
    `;
}

function newTagDefaultBtns() {
    const newTagField = document.getElementById('new_tag_btn_container');
    newTagField.innerHTML = newTagDefaultBtnsTemplate();
}

function newTagDefaultBtnsTemplate() {
    return `
            <button class="edit_text_btn" onclick="editTextBtn()"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg"
                                        alt="Icon"
                                        " /></button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="trashBtn()"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg"
                                        alt="Icon"
                                         /></button>
        </div>
    </div>
    `;
}

function replaceButtons() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container');
    const inputField = document.getElementById('tag_input_field');
    subtaskBtnContainer.innerHTML = getBtnsTemplate();
    inputField.focus();
}

function editTextBtn() {
    const newTag = document.getElementById('new_tag_input');
    newTag.focus();
    newTagBtnReplace();
}

function newTagBtnReplace() {
    const newTagReplaceBtn = document.getElementById('new_tag_btn_container');
    newTagReplaceBtn.innerHTML = newTagBtnReplaceTemplate();
}

function newTagBtnReplaceTemplate() {
    return `
        <div class="btns_position" id='new_tag_btn_container'>
            <button class="edit_text_btn" onclick="trashBtn()"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg"
                                        alt="Icon"
                                         /></button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="newTagDefaultBtns()"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
                                        alt="Icon"
                                        /></button>
        </div>
    </div>
    `;
}

function getBtnsTemplate() {
    return `
        <button class="delet_text_btn" onclick="deletTextBtn()">
                                        <img
                                            class="subtasks_icon arrow_bg_hover_color_subtask"
                                            id=""
                                            src="../assets/imgs/addTaskIcons/subtasksCancelIcon.svg"
                                            alt="Icon"
                                            />
                                    </button>
                                    <hr class="separator_vertically_subtasks" />
                                    <button class="confirm_btn" onclick="confirmSubtaskBtn()">
                                        <img
                                            class="subtasks_icon arrow_bg_hover_color_subtask"
                                            id=""
                                            src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
                                            alt="Icon"
                                           />
                                    </button>
        `;
}

