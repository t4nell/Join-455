const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdownToggleBtn');
const label = toggle.querySelector('.dropdown-label');
const menu = document.getElementById('dropdownMenu');
const items = menu.querySelectorAll('.dropdown-item');
const symbole = document.getElementById('placeholder_group');

toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) {
        symbole.classList.add('d-none');
    } else {
        symbole.classList.remove('d-none');
    }
});

items.forEach((item) => {
    item.addEventListener('click', () => {
        label.textContent = item.textContent;
        dropdown.classList.remove('open');
        symbole.classList.remove('d-none');
    });
});

document.addEventListener('click', (clickEveryWhere) => {
    if (!dropdown.contains(clickEveryWhere.target)) {
        dropdown.classList.remove('open');
        symbole.classList.remove('d-none');
    }
});

