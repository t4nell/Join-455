function renderCategories() {
    const categoryMenu = document.getElementById('category_dropdown_menu');
    categoryMenu.innerHTML = categories.map((category, index) => categoriesTemplate(category, index)).join('');
}

function toggleDropdownCategory(event) {
    const categoryDropdown = document.getElementById('category_dropdown');
    const hideRequiredMessage = document.getElementById('required_message_category');
    event.stopPropagation();

    categoryDropdown.classList.toggle('open');

    if (categoryDropdown.classList.contains('open')) {
        hideRequiredMessage.classList.add('d_none');
    } else {
        hideRequiredMessage.classList.remove('d_none');
    }
}

function selectCategory(category) {
    const categoryInput = document.getElementById('category_dropdown_input')
    const categoryDropdown = document.getElementById('category_dropdown');
    categoryInput.value = category;
    categoryDropdown.classList.remove('open');
    validateCategoryField();
}

function closeCategoryDropdown(event) {
    const dropdown = document.getElementById('category_dropdown');
    const toggle = document.getElementById('category_dropdown_input');
    const hideRequiredMessage = document.getElementById('required_message_category');

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
        dropdown.classList.remove('open');
        hideRequiredMessage.classList.remove('d_none');
    }
}

