// Radio Buttons
document.querySelectorAll('input[name="Priority"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        document.getElementById('icon-urgent').src = '../assets/imgs/addTaskIcons/priorityUrgentIcon.svg';
        document.getElementById('icon-medium').src = '../assets/imgs/addTaskIcons/priorityMediumIcon.svg';
        document.getElementById('icon-low').src = '../assets/imgs/addTaskIcons/priorityLowIcon.svg';

        if (document.getElementById('urgent').checked) {
            document.getElementById('icon-urgent').src = '../assets/imgs/addTaskIcons/priorityUrgentIconWhite.svg';
        }
        if (document.getElementById('medium').checked) {
            document.getElementById('icon-medium').src = '../assets/imgs/addTaskIcons/priorityMediumIconWhite.svg';
        }
        if (document.getElementById('low').checked) {
            document.getElementById('icon-low').src = '../assets/imgs/addTaskIcons/priorityLowIconWhite.svg';
        }
    });
});

