let allowBlur = false;
let tagCounter = 0;

function replaceButtons() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container');
    const inputField = document.getElementById('tag_input_field');
    subtaskBtnContainer.innerHTML = getBtnsTemplate();
    inputField.focus();
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
    subtaskBtnContainer.innerHTML = resetButtonsTemplate();
}

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

function enableEditing(tagInputId, tagBtnConId, tagId) {
    const input = document.getElementById(tagInputId);
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('focus');
    const tagField = input.closest('.tag_field');
    if (tagField) tagField.classList.add('editing');
    newTagTrashDoneBtn(tagInputId, tagBtnConId, tagId);
}

function editTextBtn(event, tagInputId, tagBtnConId, tagId) {
    event.stopPropagation();
    event.preventDefault();
    const input = document.getElementById(tagInputId);
    input.classList.remove('input_error_new_subtask_tag');
    const newTag = document.getElementById(tagInputId);
    newTag.removeAttribute('readonly');
    newTag.focus();
    newTag.classList.add('focus');
    const tagField = newTag.closest('.tag_field');
    if (tagField) tagField.classList.add('editing');
    newTagTrashDoneBtn(tagInputId, tagBtnConId, tagId);
}

function trashBtn(tagId) {
    const newTagField = document.getElementById(tagId);
    newTagField.remove();
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

function newTagCheckValue(event, tagBtnConId, tagInputId, tagId) {
    event.stopPropagation();
    event.preventDefault();
    const input = document.getElementById(tagInputId);
    const value = input.value.trim();

    if (value !== '') {
        allowBlur = true;
        newTagDefaultBtns(tagBtnConId, tagInputId, tagId);
        allowBlur = false;
    } else {
        input.classList.add('input_error_new_subtask_tag');
    }
}

function disableEditing(tagInputId) {
    const input = document.getElementById(tagInputId);
    if (!input) return;
    const value = input.value.trim();

    if (!allowBlur && value === '') {
        input.focus();
        input.placeholder = 'Please fill or Remove';
        input.classList.add('input_error_new_subtask_tag');
        return;
    }
    input.setAttribute('readonly', true);
    input.classList.remove('focus');
    const tagField = input.closest('.tag_field');
    if (tagField) tagField.classList.remove('editing');
}

function newTagDefaultBtns(tagBtnConId, tagInputId, tagId) {
    const newTagField = document.getElementById(tagBtnConId);
    newTagField.innerHTML = newTagDefaultBtnsTemplate(tagBtnConId, tagInputId, tagId);
}

function newTagTrashDoneBtn(tagInputId, tagBtnConId, tagId) {
    const newTagTrashDoneBtn = document.getElementById(tagBtnConId);
    newTagTrashDoneBtn.innerHTML = newTagTrashDoneBtnTemplate(tagBtnConId, tagInputId, tagId);
}

