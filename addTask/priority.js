function switchBtnPriority(btnPriority) {
    document.getElementById('icon_urgent').src = '../assets/imgs/addTaskIcons/priorityUrgentIcon.svg';
    document.getElementById('icon_medium').src = '../assets/imgs/addTaskIcons/priorityMediumIcon.svg';
    document.getElementById('icon_low').src = '../assets/imgs/addTaskIcons/priorityLowIcon.svg';

    switch (btnPriority) {
        case 'urgent':
            document.getElementById('icon_urgent').src = '../assets/imgs/addTaskIcons/priorityUrgentIconWhite.svg';
            break;
        case 'medium':
            document.getElementById('icon_medium').src = '../assets/imgs/addTaskIcons/priorityMediumIconWhite.svg';
            break;
        case 'low':
            document.getElementById('icon_low').src = '../assets/imgs/addTaskIcons/priorityLowIconWhite.svg';
            break;
    }
}
