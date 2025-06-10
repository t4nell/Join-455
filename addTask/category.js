function renderCategories() {
    const categoryMenu = document.getElementById('category_dropdown_menu');
    categoryMenu.innerHTML = categories.map((category) => categoriesTemplate(category)).join('');
}

function toggleDropdownCategory(event) {
    const categoryDropdown = document.getElementById('category_dropdown');
    event.stopPropagation();
    categoryDropdown.classList.toggle('open');
}

function selectCategory(category) {
    const categoryInput = document.getElementById('category_dropdown_input');
    const categoryDropdown = document.getElementById('category_dropdown');
    categoryInput.value = category;
    categoryDropdown.classList.remove('open');
    validateCategoryField();
}

function closeCategoryDropdown(event) {
    const categoryDropdown = document.getElementById('category_dropdown');
    const categoryInput = document.getElementById('category_dropdown_input');

    if (!categoryDropdown || !categoryInput) return;

    let currentElement = event.target;
    let clickedInside = false;

    while (currentElement) {
        if (currentElement.id === 'category_dropdown' || currentElement.id === 'category_dropdown_input') {
            clickedInside = true;
            break;
        }
        currentElement = currentElement.parentElement;
    }

    if (!clickedInside) {
        categoryDropdown.classList.remove('open');
    }
}

