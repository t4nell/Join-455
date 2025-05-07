const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdownToggleBtn');
const menu = document.getElementById('dropdownMenu');
const items = menu.querySelectorAll('.dropdown_item');
const symbole = document.getElementById('placeholder_group');

toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    symbole.classList.toggle('d-none', dropdown.classList.contains('open'));
});

items.forEach((item) => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();

        const text = item.childNodes[0].textContent.trim();
        toggle.value = text;
        dropdown.classList.remove('open');
        symbole.classList.remove('d-none');
    });
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        symbole.classList.remove('d-none');
    }
});

