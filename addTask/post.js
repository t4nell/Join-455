BASE_URL_ADDTASK;

function collectTaskData(form) {
    const fd = new FormData(form);
    const subtasksArray = fd.getAll('subtasks');
    const todo = 'todo';

    const assignedTo = {};
    selectedUserIndices.forEach((index) => {
        const contact = contactsArray[index];
        const { id, name, surname } = contact;
        const fullName = `${name} ${surname}`;

        assignedTo[id] = {
            [fullName]: true,
        };
        console.log(assignedTo[id]);
    });

    const subtasks = {};
    subtasksArray.forEach((subtask, idx) => {
        subtasks[`subtask_${idx}`] = {
            title: subtask,
            done: false,
        };
    });

    return {
        title: fd.get('title'),
        description: fd.get('description'),
        dueDate: fd.get('due_date'),
        priority: fd.get('priority'),
        assignedTo,
        category: fd.get('category'),
        subtasks,
        status: todo,
    };
}

function postTask(taskData) {
    postData('addTask', taskData);
}

async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL_ADDTASK + path + '.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
}

