function onKeyDownEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtn();
    }
}

// function checkValue() {
//     const input = document.getElementById('new_tag_input');
//     const tagFieldContainer = document.getElementById('tag_field');
//     if (input.value) {
//         confirmSubtaskBtn();
//     } else {
//         tagFieldContainer.remove();
//     }
// }

function enableEditing() {
    const input = document.getElementById('new_tag_input');
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('focus');
}

function disableEditing() {
    const input = document.getElementById('new_tag_input');
    input.setAttribute('readonly', true);
    input.classList.remove('focus');
}

function deleteTextBtn() {
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
    <input name="subtasks" class="new_tag_input" id='new_tag_input' type="text" ondblclick="enableEditing()" onblur="disableEditing()" value="${value}" readonly />
        <div class="btns_position" id='new_tag_btn_container'>
            <button class="edit_text_btn" onclick="editTextBtn(event)"><img
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
    return ` <div class="btns_position" id='new_tag_btn_container'>
            <button class="edit_text_btn" onclick="editTextBtn(event)"><img
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
    `;
}

function replaceButtons() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container');
    const inputField = document.getElementById('tag_input_field');
    subtaskBtnContainer.innerHTML = getBtnsTemplate();
    inputField.focus();
}

function editTextBtn(event) {
    event.stopPropagation();
    event.preventDefault();
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
    `;
}

function getBtnsTemplate() {
    return `
        <button class="delete_text_btn" onclick="deleteTextBtn()">
                                        <img
                                            class="subtasks_icon arrow_bg_hover_color_subtask"
                                            id=""
                                            src="../assets/imgs/addTaskIcons/subtasksCancelIconAndClearTask.svg"
                                            alt="Icon"
                                            />
                                    </button>
                                    <hr class="separator_vertically_subtasks" />
                                    <button type="button" class="confirm_btn" onclick="confirmSubtaskBtn()">
                                        <img
                                            class="subtasks_icon arrow_bg_hover_color_subtask"
                                            id=""
                                            src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
                                            alt="Icon"
                                        />
                                    </button>
        `;
}

