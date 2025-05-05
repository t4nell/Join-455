const mainContainer = document.getElementById('navbar_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

document.addEventListener('DOMContentLoaded', function () {
    flatpickr('#due-date', {
        dateFormat: 'd/m/Y',
        minDate: 'today',
        locale: {
            firstDayOfWeek: 1,
        },
    });
});

function openCalendar() {
    const calenderInput = document.getElementById('due-date');
    calenderInput.focus();
}

