const mainContainer = document.getElementById('navbar_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

// Radio Buttons
document.querySelectorAll('input[name="Priority"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        document.getElementById('icon-urgent').src = '../assets/imgs/add_task_btn_img/priority_btn_urgent.svg';
        document.getElementById('icon-medium').src =
            '../assets/imgs/add_task_btn_img/priority_btn_medium_active_yellow.svg';
        document.getElementById('icon-low').src = '../assets/imgs/add_task_btn_img/priority_btn_low.svg';

        if (document.getElementById('urgent').checked) {
            document.getElementById('icon-urgent').src =
                '../assets/imgs/add_task_btn_img/priority_btn_urgent_white.svg';
        }
        if (document.getElementById('medium').checked) {
            document.getElementById('icon-medium').src = '../assets/imgs/add_task_btn_img/priority_btn_medium.svg';
        }
        if (document.getElementById('low').checked) {
            document.getElementById('icon-low').src =
                '../assets/imgs/add_task_btn_img/priority_btn_low_active_white.svg';
        }
    });
});

// Assigned To input
const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdownToggleBtn');
const label = toggle.querySelector('.dropdown-label');
const menu = document.getElementById('dropdownMenu');
const items = menu.querySelectorAll('.dropdown-item');
const symbole = document.getElementById('placeholder_group');

toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) {
        symbole.classList.add('d-none');
    } else {
        symbole.classList.remove('d-none');
    }
});

items.forEach((item) => {
    item.addEventListener('click', () => {
        label.textContent = item.textContent;
        dropdown.classList.remove('open');
        symbole.classList.remove('d-none');
    });
});

document.addEventListener('click', (everyWhere) => {
    if (!dropdown.contains(everyWhere.target)) {
        dropdown.classList.remove('open');
        symbole.classList.remove('d-none');
    }
});
// Assigned To input ende

// Category To input
const categoryDropdown = document.getElementById('category-dropdown');
const categoryToggle = document.getElementById('category-dropdownToggleBtn');
const categoryLabel = categoryToggle.querySelector('.category-dropdown-label');
const categoryMenu = document.getElementById('category-dropdownMenu');
const categoryItems = categoryMenu.querySelectorAll('.category-dropdown-item');

categoryToggle.addEventListener('click', () => {
    categoryDropdown.classList.toggle('open');
});

categoryItems.forEach((item) => {
    item.addEventListener('click', () => {
        categoryLabel.textContent = item.textContent;
        categoryDropdown.classList.remove('open');
    });
});

document.addEventListener('click', (everyWhere) => {
    if (!categoryDropdown.contains(everyWhere.target)) {
        categoryDropdown.classList.remove('open');
    }
});
// Category To input ende

// Subtask input
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('tagInputField');
    const tagList = document.querySelector('.tag-list');
    const deletTextBtn = document.querySelector('.delet-text-btn');
    const confirmBtn = document.querySelector('.confirm-btn');

    confirmBtn.addEventListener('click', () => {
        const value = inputField.value.trim();
        if (value) {
            const newTag = document.createElement('li');
            newTag.classList.add('tag-field');
            newTag.textContent = value;
            tagList.appendChild(newTag);
            inputField.value = '';
        }
    });

    deletTextBtn.addEventListener('click', () => {
        inputField.value = '';
    });
});
// Subtask input ende

