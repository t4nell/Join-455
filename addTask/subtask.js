let allowBlur = false;
let tagCounter = 0;

/**
 * Replaces the subtask button with confirm and cancel buttons.
 *
 * @returns {void} Updates the subtask button container and focuses on the input field.
 */
function replaceButtons() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container');
    const inputField = document.getElementById('tag_input_field');
    subtaskBtnContainer.innerHTML = getBtnsTemplate();
    inputField.focus();
}

/**
 * Handles Enter key press in the subtask input field.
 *
 * @param {Event} event - The keyboard event object.
 * @returns {void} Prevents default behavior and confirms the subtask.
 */
function onKeyDownEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmSubtaskBtn();
    }
}

/**
 * Checks if the subtask input field has a value and acts accordingly.
 *
 * @returns {void} Either confirms the subtask or resets the buttons.
 */
function checkValue() {
    const input = document.getElementById('tag_input_field');
    const value = input.value.trim();
    if (value !== '') {
        confirmSubtaskBtn();
    } else {
        resetButtons();
    }
}

/**
 * Clears the text in the subtask input field.
 *
 * @returns {void} Empties the input field and resets the buttons.
 */
function deleteTextBtn() {
    const inputField = document.getElementById('tag_input_field');
    inputField.value = '';
    resetButtons();
}

/**
 * Resets the subtask button container to its default state.
 *
 * @returns {void} Updates the subtask button container with default template.
 */
function resetButtons() {
    const subtaskBtnContainer = document.getElementById('subtask_btn_container');
    subtaskBtnContainer.innerHTML = resetButtonsTemplate();
}

/**
 * Automatically resizes a textarea to fit its content.
 *
 * @param {HTMLElement} el - The textarea element to resize.
 * @returns {void} Adjusts the height of the textarea.
 */
function autoResizeTextarea(element) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
}

/**
 * Enables editing mode for a subtask.
 *
 * @param {string} tagInputId - ID of the subtask input field.
 * @param {string} tagBtnConId - ID of the subtask button container.
 * @param {string} tagId - ID of the subtask element.
 * @returns {void} Makes the input field editable and updates button display.
 */
function enableEditing(tagInputId, tagBtnConId, tagId) {
    const input = document.getElementById(tagInputId);
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('focus');
    const tagField = input.closest('.tag_field');
    if (tagField) tagField.classList.add('editing');
    newTagTrashDoneBtn(tagInputId, tagBtnConId, tagId);
}

/**
 * Handles the edit button click for a subtask.
 *
 * @param {Event} event - The click event object.
 * @param {string} tagInputId - ID of the subtask input field.
 * @param {string} tagBtnConId - ID of the subtask button container.
 * @param {string} tagId - ID of the subtask element.
 * @returns {void} Puts the subtask in edit mode.
 */
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

/**
 * Removes a subtask from the DOM.
 *
 * @param {string} tagId - ID of the subtask element to remove.
 * @returns {void} Removes the subtask element from the document.
 */
function trashBtn(tagId) {
    const newTagField = document.getElementById(tagId);
    newTagField.remove();
}

/**
 * Adds a new subtask from the input field value.
 *
 * @returns {void} Creates a new subtask element and resets the input field.
 */
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

/**
 * Validates the value of a subtask field when confirming edits.
 *
 * @param {Event} event - The event object.
 * @param {string} tagBtnConId - ID of the button container.
 * @param {string} tagInputId - ID of the input field.
 * @param {string} tagId - ID of the subtask element.
 * @returns {void} Either confirms the edit or shows an error.
 */
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

/**
 * Disables editing mode for a subtask input field.
 *
 * @param {string} tagInputId - ID of the input field.
 * @returns {void} Makes the input field read-only or shows an error.
 */
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

/**
 * Restores default buttons for a subtask.
 *
 * @param {string} tagBtnConId - ID of the button container.
 * @param {string} tagInputId - ID of the input field.
 * @param {string} tagId - ID of the subtask element.
 * @returns {void} Updates the button container with default buttons.
 */
function newTagDefaultBtns(tagBtnConId, tagInputId, tagId) {
    const newTagField = document.getElementById(tagBtnConId);
    newTagField.innerHTML = newTagDefaultBtnsTemplate(tagBtnConId, tagInputId, tagId);
}

/**
 * Updates a subtask's buttons to show trash and done buttons.
 *
 * @param {string} tagInputId - ID of the input field.
 * @param {string} tagBtnConId - ID of the button container.
 * @param {string} tagId - ID of the subtask element.
 * @returns {void} Updates the button container with trash and done buttons.
 */
function newTagTrashDoneBtn(tagInputId, tagBtnConId, tagId) {
    const newTagTrashDoneBtn = document.getElementById(tagBtnConId);
    newTagTrashDoneBtn.innerHTML = newTagTrashDoneBtnTemplate(tagBtnConId, tagInputId, tagId);
}

