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

