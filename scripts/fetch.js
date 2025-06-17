const allTasks = [];
BASE_URL = "https://join-455-default-rtdb.europe-west1.firebasedatabase.app/"

/**
 * Asynchronously loads data from the Firebase Realtime Database.
 * 
 * Fetches data from the specified path in the database, extracts the task data,
 * and logs the extracted tasks to the console.
 * 
 * @async
 * @function loadAllData
 * @param {string} [path=""] - The database path to fetch data from
 * @returns {Promise<void>}
 */
async function loadAllData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    
    const addTaskData = responseToJson.addTask;
    const allTasks = Object.values(addTaskData);
    console.log(allTasks);
};