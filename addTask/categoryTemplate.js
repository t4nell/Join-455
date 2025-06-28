/**
 * Generates HTML for a category item in the dropdown menu.
 * 
 * @param {string} category - The category text to display.
 * @param {number} index - Index of the category in the categories array.
 * @returns {string} HTML markup for the category list item.
 */
function categoriesTemplate(category, index) {
    return `
        <li
            id="category_item_${index}"
            class="category_dropdown_item"
            onclick="selectCategory('${category}')"
        >
            ${category}
        </li>
    `;
};
