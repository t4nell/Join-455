/**
 * Renders all categories in the category dropdown menu.
 *
 * @returns {void} Updates the category dropdown menu with category items.
 */
function renderCategories() {
    const categoryMenu = document.getElementById('category_dropdown_menu');
    categoryMenu.innerHTML = categories.map((category, index) => categoriesTemplate(category, index)).join('');
};


/**
 * Listens for clicks outside the category dropdown and closes the dropdown if a click occurs outside.
 *
 * @param {MouseEvent} event - The click event triggered anywhere in the document.
 * @returns {void} Closes the category dropdown if the click is outside relevant elements.
 */
document.addEventListener('click', function (event) {
    const categoryDropdown = document.getElementById('category_dropdown');
    const categoryInput = document.getElementById('category_dropdown_input');

    if (categoryDropdown && !categoryDropdown.contains(event.target) && !categoryInput.contains(event.target)) {
        closeCategoryDropdown();
    }
});

/**
 * Toggles the visibility of the category dropdown menu.
 *
 * @param {Event} event - The click event that triggered the function.
 * @returns {void} Shows or hides the category dropdown.
 */
function toggleDropdownCategory(event) {
    event.stopPropagation();
    if (typeof closeAssignedDropdown === 'function') {
        closeAssignedDropdown();
    }

    const categoryDropdown = document.getElementById('category_dropdown');
    const hideRequiredMessage = document.getElementById('required_message_category');

    categoryDropdown.classList.toggle('open');

    if (categoryDropdown.classList.contains('open')) {
        hideRequiredMessage.classList.add('d_none');
    } else {
        hideRequiredMessage.classList.remove('d_none');
    }
};


/**
 * Selects a category and updates the input field value.
 *
 * @param {string} category - The category text to select.
 * @returns {void} Updates the category input field and validates it.
 */
function selectCategory(category) {
    const categoryInput = document.getElementById('category_dropdown_input');
    const categoryDropdown = document.getElementById('category_dropdown');
    categoryInput.value = category;
    categoryDropdown.classList.remove('open');
    validateCategoryField();
};


/**
 * Closes the category dropdown.
 *
 * @returns {void} Closes the dropdown and updates UI elements.
 */
function closeCategoryDropdown() {
    const dropdown = document.getElementById('category_dropdown');
    const hideRequiredMessage = document.getElementById('required_message_category');

    if (dropdown) {
        dropdown.classList.remove('open');
    }

    if (hideRequiredMessage) {
        hideRequiredMessage.classList.remove('d_none');
    }
};

