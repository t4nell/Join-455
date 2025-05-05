function onKeyDownEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtn();
    }
}

function deletTextBtn() {
    const inputField = document.getElementById('tagInputField');
    inputField.value = '';
    resetButtons();
}

function confirmSubtaskBtn() {
    const inputField = document.getElementById('tagInputField');
    const value = inputField.value.trim();
    const newTagCon = document.getElementById('newTag-container');
    if (value) {
        newTagCon.innerHTML += getNewTagTemplate(value);
        inputField.value = '';
        resetButtons();
    }
}

function resetButtons() {
    const subtaskBtnContainer = document.getElementById('subtask-btn-container');
    subtaskBtnContainer.innerHTML = `
        <button class="plus-btn" onclick="replaceButtons()">
            <img
                class="icon arrow-bg-hover-color-subtask"
                src="../assets/imgs/add_task_btn_img/subtasks_plus_icon.svg"
                alt="New Button Icon"
                width="24"
                height="24" />
        </button>
    `;
}

function trashBtn() {
    const newTagField = document.getElementById('tag-field');
    newTagField.remove();
}

function getNewTagTemplate(value) {
    return `
    <div class="tag-field" id='tag-field'>
    <span class="tag-prefix">・</span>
    <input class="newTag-input" id='newTag-input' type="text" value="${value}" />
        <div class="btns-position" id='newTag-btn-container'>
            <button class="edit-text-btn" onclick="editTextBtn()"><img
                                        class="icon"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_edit_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
            <hr class="separator_vertically" />
            <button class="trash-btn" onclick="trashBtn()"><img
                                        class="icon"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_delete_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
        </div>
    </div>
    `;
}

function newTagDefaultBtns() {
    const newTagField = document.getElementById('newTag-btn-container');
    newTagField.innerHTML = newTagDefaultBtnsTemplate();
}

function newTagDefaultBtnsTemplate() {
    return `
            <button class="edit-text-btn" onclick="editTextBtn()"><img
                                        class="icon"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_edit_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
            <hr class="separator_vertically" />
            <button class="trash-btn" onclick="trashBtn()"><img
                                        class="icon"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_delete_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
        </div>
    </div>
    `;
}

function replaceButtons() {
    const subtaskBtnContainer = document.getElementById('subtask-btn-container');
    const inputField = document.getElementById('tagInputField');
    subtaskBtnContainer.innerHTML = getBtnsTemplate();
    inputField.focus();
}

function editTextBtn() {
    const newTag = document.getElementById('newTag-input');
    newTag.focus();
    newTagBtnReplace();
}

function newTagBtnReplace() {
    const newTagReplaceBtn = document.getElementById('newTag-btn-container');
    newTagReplaceBtn.innerHTML = newTagBtnReplaceTemplate();
}

function newTagBtnReplaceTemplate() {
    return `
        <div class="btns-position" id='newTag-btn-container'>
            <button class="edit-text-btn" onclick="trashBtn()"><img
                                        class="icon"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_delete_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
            <hr class="separator_vertically" />
            <button class="trash-btn" onclick="newTagDefaultBtns()"><img
                                        class="icon"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_done_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
        </div>
    </div>
    `;
}

function getBtnsTemplate() {
    return `
        <button class="delet-text-btn" onclick="deletTextBtn()">
                                        <img
                                            class="icon arrow-bg-hover-color-subtask"
                                            id="icon-low"
                                            src="../assets/imgs/add_task_btn_img/subtasks_x_cancel_icon.svg"
                                            alt="Icon"
                                            width="24"
                                            height="24" />
                                    </button>
                                    <hr class="separator_vertically" />
                                    <button class="confirm-btn" onclick="confirmSubtaskBtn()">
                                        <img
                                            class="icon arrow-bg-hover-color-subtask"
                                            id="icon-low"
                                            src="../assets/imgs/add_task_btn_img/subtask_done_icon.svg"
                                            alt="Icon"
                                            width="24"
                                            height="24" />
                                    </button>
        `;
}

