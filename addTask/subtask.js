function onKeyDownEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtn();
    }
}

function deletTextBtn() {
    const inputField = document.getElementById('tagInputField');
    inputField.value = '';
}

function confirmSubtaskBtn() {
    const inputField = document.getElementById('tagInputField');
    const value = inputField.value.trim();
    const newTagCon = document.getElementById('newTag-container');
    if (value) {
        newTagCon.innerHTML += getNewTagTemplate(value);
        inputField.value = '';
    }
}

function trashBtn() {
    const newTagField = document.getElementById('tag-field');
    newTagField.remove();
}

function getNewTagTemplate(value) {
    return `
    <div class="tag-field" id='tag-field'>
    <span class="tag-prefix">・</span>
    <input class="newTag-input" type="text" value="${value}" />
        <div class="btns-position">
            <button class="edit-text-btn" onclick="editTextBtn()"><img
                                        class="icon arrow-bg-hover-color-subtask"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_edit_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
            <hr class="separator_vertically" />
            <button class="trash-btn" onclick="trashBtn()"><img
                                        class="icon arrow-bg-hover-color-subtask"
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
    subtaskBtnContainer.innerHTML = getBtnsTemplate();
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

