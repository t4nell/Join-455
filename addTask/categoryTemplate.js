function categoriesTemplate(category) {
    return `
        <li class="category_dropdown_item" onclick="selectCategory('${category}')">
            ${category}
        </li>
    `;
}

