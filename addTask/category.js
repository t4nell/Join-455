const categories = [
    'User Story',
    'Technical Task',
    'To Do',
    'Backlog',
    'Design',
    'In Progress',
    'In Review',
    'Blocked',
    'Testing',
    'Done',
    'Archived',
];

const categoryDropdown = document.getElementById('category_dropdown');
const categoryInput = document.getElementById('category_dropdown_input');
const categoryMenu = document.getElementById('category_dropdown_menu');

function renderCategories() {
    categoryMenu.innerHTML = categories.map((category) => categoriesTemplate(category)).join('');
}

function categoriesTemplate(category) {
    return `
        <li class="category_dropdown_item" onclick="selectCategory('${category}')">
            ${category}
        </li>
    `;
}

function toggleDropdownCategory(event) {
    event.stopPropagation();
    categoryDropdown.classList.toggle('open');
}

function selectCategory(category) {
    categoryInput.value = category;
    categoryDropdown.classList.remove('open');
    createTaskBtnEnable();
}

renderCategories();

document.addEventListener('click', (e) => {
    if (!categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove('open');
    }
});

