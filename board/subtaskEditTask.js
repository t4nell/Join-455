let allowBlurEditTask = false;
let tagCounterEditTask = 0;

function replaceButtonsEditTask() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container_edit_task');
    const inputField = document.getElementById('tag_input_field_edit_task');
    subtaskBtnContainer.innerHTML = getBtnsTemplateEditTask();
    inputField.focus();
}

function onKeyDownEnterEditTask(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtnEditTask();
    }
}

function checkValueEditTask() {
    const input = document.getElementById('tag_input_field_edit_task');
    const value = input.value.trim();
    if (value !== '') {
        confirmSubtaskBtnEditTask();
    } else {
        resetButtonsEditTask();
    }
}

function deleteTextBtnEditTask() {
    const inputField = document.getElementById('tag_input_field_edit_task');
    inputField.value = '';
    resetButtonsEditTask();
}

function resetButtonsEditTask() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container_edit_task');
    subtaskBtnContainer.innerHTML = resetButtonsTemplateEditTask();
}

function autoResizeTextareaEditTask(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

function enableEditingEditTask(tagInputId, tagBtnConId, tagId) {
    const input = document.getElementById(tagInputId);
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('focus');
    const tagField = input.closest('.tag_field');
    if (tagField) tagField.classList.add('editing');
    newTagTrashDoneBtnEditTask(tagInputId, tagBtnConId, tagId);
}

function editTextBtnEditTask(event, tagInputId, tagBtnConId, tagId) {
    event.stopPropagation();
    event.preventDefault();
    const input = document.getElementById(tagInputId);
    input.classList.remove('input_error_new_subtask_tag_edit_task');
    const newTag = document.getElementById(tagInputId);
    newTag.removeAttribute('readonly');
    newTag.focus();
    newTag.classList.add('focus');
    const tagField = newTag.closest('.tag_field');
    if (tagField) tagField.classList.add('editing');
    newTagTrashDoneBtnEditTask(tagInputId, tagBtnConId, tagId);
}

function trashBtnEditTask(tagId) {
    const newTagField = document.getElementById(tagId);
    newTagField.remove();
}

function confirmSubtaskBtnEditTask() {
    const inputField = document.getElementById('tag_input_field_edit_task');
    const value = inputField.value.trim();
    const newTagCon = document.getElementById('new_tag_container_edit_task');
    if (value) {
        tagCounterEditTask++;
        const tagId = `tag_field_${tagCounterEditTask}_edit_task`;
        const tagInputId = `new_tag_input_${tagCounterEditTask}_edit_task`;
        const tagBtnConId = `new_tag_btn_container_${tagCounterEditTask}_edit_task`;
        newTagCon.innerHTML += getNewTagTemplateEditTask(value, tagId, tagInputId, tagBtnConId);
        inputField.value = '';
        resetButtonsEditTask();
    }
}

function newTagCheckValueEditTask(event, tagBtnConId, tagInputId, tagId) {
    event.stopPropagation();
    event.preventDefault();
    const input = document.getElementById(tagInputId);
    const value = input.value.trim();
    if (value !== '') {
        allowBlurEditTask = true;
        newTagDefaultBtnsEditTask(tagBtnConId, tagInputId, tagId);
        allowBlurEditTask = false;
    } else {
        input.classList.add('input_error_new_subtask_tag_edit_task');
    }
}

function disableEditingEditTask(tagInputId) {
    const input = document.getElementById(tagInputId);
    if (!input) return;
    const value = input.value.trim();
    if (!allowBlurEditTask && value === '') {
        input.focus();
        input.placeholder = 'Please fill or Remove';
        input.classList.add('input_error_new_subtask_tag_edit_task');
        return;
    }
    input.setAttribute('readonly', true);
    input.classList.remove('focus');
    const tagField = input.closest('.tag_field');
    if (tagField) tagField.classList.remove('editing');
}

function newTagDefaultBtnsEditTask(tagBtnConId, tagInputId, tagId) {
    const newTagField = document.getElementById(tagBtnConId);
    newTagField.innerHTML = newTagDefaultBtnsTemplateEditTask(tagBtnConId, tagInputId, tagId);
}

function newTagTrashDoneBtnEditTask(tagInputId, tagBtnConId, tagId) {
    const newTagTrashDoneBtn = document.getElementById(tagBtnConId);
    newTagTrashDoneBtn.innerHTML = newTagTrashDoneBtnTemplateEditTask(tagBtnConId, tagInputId, tagId);
}

