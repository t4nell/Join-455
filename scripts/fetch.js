const allTasks = [];

BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadAllData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    
    const addTaskData = responseToJson.addTask;
    const allTasks = Object.values(addTaskData);
    console.log(allTasks);
}
