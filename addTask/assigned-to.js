const dropdown = document.getElementById('dropdown');
const toggle = document.getElementById('dropdown_toggle_btn');
const menu = document.getElementById('dropdown_menu');
const items = menu.querySelectorAll('.dropdown_item');
const symbole = document.getElementById('placeholder_group');

function toggleDropdownAssigned(event) {
    event.stopPropagation();
    dropdown.classList.toggle('open');
    symbole.classList.toggle('d_none', dropdown.classList.contains('open'));
}

function selectAssignedItem(event, item) {
    event.stopPropagation();
    const checkedBtn = item.getElementById('option_1');
    checkedBtn.checked = !checkedBtn.checked;
    updateAssignedDisplay();
}

// function updateAssignedDisplay() {
//     const checked = menu.getElementById('option_1'.checked);
//     const names = Array.from(checked).map((i) => i.value);
//     toggle.value = names.join(', ') || 'Select contacts to assign';
// }

document.onclick = function (event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        symbole.classList.remove('d_none');
    }
};

