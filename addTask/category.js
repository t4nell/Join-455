/**
 * Renders all categories in the category dropdown menu.
 * 
 * @returns {void} Updates the category dropdown menu with category items.
 */
function renderCategories() {
    const categoryMenu = document.getElementById('category_dropdown_menu');
    categoryMenu.innerHTML = categories.map((category, index) => categoriesTemplate(category, index)).join('');
}

/**
 * Toggles the visibility of the category dropdown menu.
 * 
 * @param {Event} event - The click event that triggered the function.
 * @returns {void} Shows or hides the category dropdown.
 */
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

/**
 * Selects a category and updates the input field value.
 * 
 * @param {string} category - The category text to select.
 * @returns {void} Updates the category input field and validates it.
 */
function selectCategory(category) {
    const categoryInput = document.getElementById('category_dropdown_input')
    const categoryDropdown = document.getElementById('category_dropdown');
    categoryInput.value = category;
    categoryDropdown.classList.remove('open');
    validateCategoryField();
}

/**
 * Closes the category dropdown when clicking outside of it.
 * 
 * @param {Event} event - The click event to check for outside clicks.
 * @returns {void} Closes the dropdown if clicked outside.
 */
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

