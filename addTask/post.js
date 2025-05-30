console.log('----------------Funktion zum sammeln der Daten----------------------');

// function collectTaskData(form) {
//     const fd = new FormData(form);
//     const subtasksArray = fd.getAll('subtasks');
//     const todo = 'todo';

//     const assignedTo = {};
//     selectedUserIndices.forEach((index) => {
//         const contact = contactsArray[index];
//         const name = `${contact.name} ${contact.surname}`;
//         assignedTo[name] = true;
//     });

//     const subtasks = {};
//     subtasksArray.forEach((subtask, index) => {
//         subtasks[`subtask_${index}`] = {
//             title: subtask,
//             done: false,
//         };
//     });

//     const task = {
//         title: fd.get('title'),
//         description: fd.get('description'),
//         dueDate: fd.get('due_date'),
//         priority: fd.get('priority'),
//         assignedTo: assignedTo,
//         category: fd.get('category'),
//         subtasks: subtasks,
//         status: todo,
//     };

//     return task;
// }

function collectTaskData(form) {
    const fd = new FormData(form);
    const subtasksArray = fd.getAll('subtasks');
    const todo = 'todo';

    const assignedTo = {};
    selectedUserIndices.forEach((index) => {
        const contact = contactsArray[index];
        const { id, name, surname } = contact;
        const fullName = `${name} ${surname}`;

        // assignedTo[id] = {
        //     [fullName]: true,
        // };

        assignedTo[id] = {
            name: fullName,
            assigned: true,
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

console.log('----------------Firebase POST Funktion----------------------');
const BASE_URL_TWO = 'https://join-455-default-rtdb.europe-west1.firebasedatabase.app/';
console.log('----------------Base url ist noch nicht richtig implementiert ?????----------------------');

function postTask(taskData) {
    console.log('Post Funktioniert');

    // Deaktivieren DerPost Funktion
    // postData('addTask', taskData);
    // Deaktivieren DerPost Funktion
}

async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL_TWO + path + '.json', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    });

    return (responseToJson = await response.json());
}

