// Elemente referenzieren
const categoryDropdown = document.getElementById('category_dropdown');
const categoryToggle = document.getElementById('categoryDropdownInput');
const categoryMenu = document.getElementById('category-dropdownMenu');
const categoryItems = categoryMenu.querySelectorAll('.category_dropdown_item');

// Klick auf das Input öffnet/schließt das Dropdown
categoryToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryDropdown.classList.toggle('open');
});

// Klick auf einen Listeneintrag übernimmt den Text ins Input und schließt das Menü
categoryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryToggle.value = item.textContent.trim();
        categoryDropdown.classList.remove('open');
    });
});

// Klick außerhalb schließt das Dropdown
document.addEventListener('click', (e) => {
    if (!categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove('open');
    }
});

