let allowBlurEditTask = false;
let tagCounterEditTask = 0;

/**
 * Replaces default subtask buttons with edit buttons
 *
 * @returns {void} Updates button container with edit buttons
 */
function replaceButtonsEditTask() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container_edit_task');
    const inputField = document.getElementById('tag_input_field_edit_task');
    subtaskBtnContainer.innerHTML = getBtnsTemplateEditTask();
    inputField.focus();
}

/**
 * Handles Enter key press in subtask input field
 *
 * @param {KeyboardEvent} event - Keyboard event object
 * @returns {void} Triggers subtask confirmation on Enter
 */
function onKeyDownEnterEditTask(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtnEditTask();
    }
}

/**
 * Validates subtask input value
 *
 * @returns {void} Confirms or resets based on input value
 */
function checkValueEditTask() {
    const input = document.getElementById('tag_input_field_edit_task');
    const value = input.value.trim();
    if (value !== '') {
        confirmSubtaskBtnEditTask();
    } else {
        resetButtonsEditTask();
    }
}

/**
 * Clears subtask input field and resets buttons
 *
 * @returns {void} Clears input and restores default buttons
 */
function deleteTextBtnEditTask() {
    const inputField = document.getElementById('tag_input_field_edit_task');
    inputField.value = '';
    resetButtonsEditTask();
}

/**
 * Resets subtask buttons to default state
 *
 * @returns {void} Restores default button template
 */
function resetButtonsEditTask() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container_edit_task');
    subtaskBtnContainer.innerHTML = resetButtonsTemplateEditTask();
}

/**
 * Automatically resizes textarea based on content
 *
 * @param {HTMLElement} element - Textarea element to resize
 * @returns {void} Updates textarea height and adds event listeners
 */
function autoResizeTextareaEditTask(element) {
    adjustHeight(element);

    window.addEventListener('resize', function () {
        adjustHeight(element);
    });
}

function adjustHeight(element) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
}

/**
 * Enables editing mode for a subtask
 *
 * @param {string} tagInputId - ID of input field
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagId - ID of subtask element
 * @returns {void} Enables input editing and updates UI
 */
function enableEditingEditTask(tagInputId, tagBtnConId, tagId) {
    const input = document.getElementById(tagInputId);
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('focus');
    const tagField = input.closest('.tag_field');
    if (tagField) tagField.classList.add('editing');
    newTagTrashDoneBtnEditTask(tagInputId, tagBtnConId, tagId);
}

/**
 * Handles edit button click for subtask
 *
 * @param {Event} event - Click event object
 * @param {string} tagInputId - ID of input field
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagId - ID of subtask element
 * @returns {void} Enables editing mode for subtask
 */
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

/**
 * Removes a subtask element
 *
 * @param {string} tagId - ID of subtask to remove
 * @returns {void} Removes subtask from DOM
 */
function trashBtnEditTask(tagId) {
    const newTagField = document.getElementById(tagId);
    newTagField.remove();
}

/**
 * Confirms and adds new subtask
 *
 * @returns {void} Creates new subtask element if input is valid
 */
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

/**
 * Validates edited subtask value
 *
 * @param {Event} event - Event object
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagInputId - ID of input field
 * @param {string} tagId - ID of subtask element
 * @returns {void} Updates or shows error based on validation
 */
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

/**
 * Disables editing mode for subtask
 *
 * @param {string} tagInputId - ID of input field
 * @returns {void} Disables editing and updates UI state
 */
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

/**
 * Updates button container to default state
 *
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagInputId - ID of input field
 * @param {string} tagId - ID of subtask element
 * @returns {void} Updates button container with default buttons
 */
function newTagDefaultBtnsEditTask(tagBtnConId, tagInputId, tagId) {
    const newTagField = document.getElementById(tagBtnConId);
    newTagField.innerHTML = newTagDefaultBtnsTemplateEditTask(tagBtnConId, tagInputId, tagId);
}

/**
 * Updates button container to editing state
 *
 * @param {string} tagInputId - ID of input field
 * @param {string} tagBtnConId - ID of button container
 * @param {string} tagId - ID of subtask element
 * @returns {void} Updates button container with editing buttons
 */
function newTagTrashDoneBtnEditTask(tagInputId, tagBtnConId, tagId) {
    const newTagTrashDoneBtn = document.getElementById(tagBtnConId);
    newTagTrashDoneBtn.innerHTML = newTagTrashDoneBtnTemplateEditTask(tagBtnConId, tagInputId, tagId);
}

