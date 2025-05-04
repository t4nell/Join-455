document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('tagInputField');
    const newTag = document.getElementById('newTag-input');
    const deletTextBtn = document.querySelector('.delet-text-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    const editBtn = document.querySelector('.edit-text-btn');

    confirmBtn.addEventListener('click', () => {
        confirmSubtask();
    });

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            confirmSubtask();
        }
    });

    deletTextBtn.addEventListener('click', () => {
        inputField.value = '';
    });

    function confirmSubtask() {
        const value = inputField.value.trim();
        const newTagCon = document.getElementById('newTag-container');
        if (value) {
            newTagCon.innerHTML += getNewTagTemplate(value);
            inputField.value = '';
            addTrashEventListeners();
        }
    }

    function addTrashEventListeners() {
        const trashTagBtns = document.querySelectorAll('.trash-btn');
        trashTagBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                btn.closest('.tag-field').remove();
            });
        });
    }

    addTrashEventListeners();
});

function getNewTagTemplate(value) {
    return `
    <div class="tag-field">
    <span class="tag-prefix">・</span>
    <input class="newTag-input" type="text" value="${value}" />
        <div class="btns-position">
            <button class="edit-text-btn"><img
                                        class="icon arrow-bg-hover-color-subtask"
                                        id="icon-low"
                                        src="../assets/imgs/add_task_btn_img/subtask_edit_icon.svg"
                                        alt="Icon"
                                        width="24"
                                        height="24" /></button>
            <hr class="separator_vertically" />
            <button class="trash-btn"><img
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

