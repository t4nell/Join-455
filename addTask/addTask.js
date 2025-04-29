const mainContainer = document.getElementById('navbar_container');

function renderSidebar() {
    mainContainer.innerHTML += getSidebarTemplate();
}

document.querySelectorAll('input[name="Priority"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        document.getElementById('icon-urgent').src = '../assets/imgs/add_task_btn_img/priority_btn_urgent.svg';
        document.getElementById('icon-medium').src =
            '../assets/imgs/add_task_btn_img/priority_btn_medium_active_yellow.svg';
        document.getElementById('icon-low').src = '../assets/imgs/add_task_btn_img/priority_btn_low.svg';

        if (document.getElementById('urgent').checked) {
            document.getElementById('icon-urgent').src =
                '../assets/imgs/add_task_btn_img/priority_btn_urgent_white.svg';
        }
        if (document.getElementById('medium').checked) {
            document.getElementById('icon-medium').src = '../assets/imgs/add_task_btn_img/priority_btn_medium.svg';
        }
        if (document.getElementById('low').checked) {
            document.getElementById('icon-low').src =
                '../assets/imgs/add_task_btn_img/priority_btn_low_active_white.svg';
        }
    });
});

