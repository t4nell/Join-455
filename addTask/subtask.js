let tagCounter = 0;

function enableEditing(tagInputId, tagBtnConId, tagId) {
    const input = document.getElementById(tagInputId);
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('focus');
    newTagBtnReplace(tagInputId, tagBtnConId, tagId);
}

function disableEditing(tagInputId) {
    const input = document.getElementById(tagInputId);
    input.setAttribute('readonly', true);
    input.classList.remove('focus');
}

function confirmSubtaskBtn() {
    const inputField = document.getElementById('tag_input_field');
    const value = inputField.value.trim();
    const newTagCon = document.getElementById('new_tag_container');
    if (value) {
        tagCounter++;

        const tagId = `tag_field_${tagCounter}`;
        const tagInputId = `new_tag_input_${tagCounter}`;
        const tagBtnConId = `new_tag_btn_container_${tagCounter}`;
        newTagCon.innerHTML += getNewTagTemplate(value, tagId, tagInputId, tagBtnConId);
        inputField.value = '';
        resetButtons();
    }
}

function trashBtn(tagId) {
    const newTagField = document.getElementById(tagId);
    newTagField.remove();
}

function getNewTagTemplate(value, tagId, tagInputId, tagBtnConId) {
    return `
    <div class="tag_field" id='${tagId}'>
    <input name="subtasks" class="new_tag_input" id='${tagInputId}' type="text" ondblclick="enableEditing('${tagInputId}', '${tagBtnConId}', '${tagId}')" onblur="disableEditing('${tagInputId}')" value='${value}' readonly />
        <div id='${tagBtnConId}'>
        <div class="btns_position">
            <button class="edit_text_btn" onclick="editTextBtn(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg"
                                        alt="Icon"
                                        /></button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="trashBtn('${tagId}')"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg"
                                        alt="Icon"
                                    /></button>
        </div>
        </div>
    </div>
    `;
}

function newTagDefaultBtns(tagBtnConId, tagInputId, tagId) {
    const newTagField = document.getElementById(tagBtnConId);
    newTagField.innerHTML = newTagDefaultBtnsTemplate(tagBtnConId, tagInputId, tagId);
}

function newTagDefaultBtnsTemplate(tagBtnConId, tagInputId, tagId) {
    return `<div class="btns_position">
            <button class="edit_text_btn" onclick="editTextBtn(event, '${tagInputId}', '${tagBtnConId}', '${tagId}')"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksEditIcon.svg"
                                        alt="Icon"
                                        /></button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="trashBtn('${tagId}')"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg"
                                        alt="Icon"
                                        /></button>
                                        </div>
    `;
}

function editTextBtn(event, tagInputId, tagBtnConId, tagId) {
    event.stopPropagation();
    event.preventDefault();
    const newTag = document.getElementById(tagInputId);
    newTag.removeAttribute('readonly');
    newTag.focus();
    newTag.classList.add('focus');
    newTagBtnReplace(tagInputId, tagBtnConId, tagId);
}

function newTagBtnReplace(tagInputId, tagBtnConId, tagId) {
    const newTagReplaceBtn = document.getElementById(tagBtnConId);
    newTagReplaceBtn.innerHTML = newTagBtnReplaceTemplate(tagBtnConId, tagInputId, tagId);
}

function newTagBtnReplaceTemplate(tagBtnConId, tagInputId, tagId) {
    return ` <div class="btns_position_two">
            <button class="edit_text_btn" onclick="trashBtn('${tagId}')"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksTrashIcon.svg"
                                        alt="Icon"
                                        /></button>
            <hr class="separator_vertically_subtasks" />
            <button class="trash_btn" onclick="newTagDefaultBtns('${tagBtnConId}', '${tagInputId}', '${tagId}')"><img
                                        class="subtasks_icon"
                                        id=""
                                        src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
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
                                    <button type="button" class="confirm_btn" onclick="checkValue()">
                                        <img
                                            class="subtasks_icon arrow_bg_hover_color_subtask"
                                            id=""
                                            src="../assets/imgs/addTaskIcons/subtasksDoneIcon.svg"
                                            alt="Icon"
                                        />
                                    </button>
        `;
}

function onKeyDownEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtn();
    }
}

function checkValue() {
    const input = document.getElementById('tag_input_field');
    const value = input.value.trim();
    if (value !== '') {
        confirmSubtaskBtn();
    } else {
        resetButtons();
    }
}

function deleteTextBtn() {
    const inputField = document.getElementById('tag_input_field');
    inputField.value = '';
    resetButtons();
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

