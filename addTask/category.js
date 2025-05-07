const categoryDropdown = document.getElementById('category_dropdown');
const categoryToggle = document.getElementById('categoryDropdownInput');
const categoryMenu = document.getElementById('category-dropdownMenu');
const categoryItems = categoryMenu.querySelectorAll('.category_dropdown_item');

categoryToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryDropdown.classList.toggle('open');
});

categoryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryToggle.value = item.textContent.trim();
        categoryDropdown.classList.remove('open');
    });
});

document.addEventListener('click', (e) => {
    if (!categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove('open');
    }
});

