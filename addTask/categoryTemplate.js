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
}
