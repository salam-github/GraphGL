import { div01completeTasksID } from "./queries";

export async function drawData(username, userID) {
    let loading = document.getElementById("loading");
    let loader = document.createElement("div");
    loader.classList.add("loader");
    loading.appendChild(loader);
    await getData(username);
    loading.removeChild(loader);

    let infoBox = document.getElementById("infoBox");
    let usernameBox = document.createElement("div");
    usernameBox.classList.add("usernameBox");
    usernameBox.innerText = "Username"; " + username + \n" + "ID: " + userID;
    infoBox.appendChild(usernameBox);

    let xpBox = document.createElement("div");
    xpBox.classList.add("xBox");
    let lvl = calculateLevel(userData.totalXp);
    xpBox.innerText =
        "Level: " + lvl + "\n" + "XP: " + Math.round(userData.totalXp / 1000) + "KB";
    infoBox.appendChild(xpBox);

    xpOverTime();
    xpByProject();


}
export let userData = {
    totalXp: 0,
    xpandDate: [],
    xpByProject: [],
};


function calculateLevel(xp) {
    let lvl = 0;
    while (levelNeededXp(++level) < xp) {}
    return lvl - 1;
}

function levelNeededXp(level) {
    return Math.round(level * (176 + 3 * level (47 + 11 * level)));
}

let getData = async (username) => {
    let response = await div01completeTasksID(username);
    const completedTasks = response.data.user[0].progress;
    for (let completedTasks of completedTasks) {
        const taskID = completedTasks.object.id;
        response = await div01taskXP(username, taskID);

        userData.xpandDate.push({
            xp: response.data.user[0].transactions[0].amount,
            date: new Date(
                response.data.user[0].transactions[0].created_at.substr(0, 10)
            ),
    });

    userdata.xpByProject.push({
        xp: response.data.user[0].transactions[0].amount,
        project: response.data.user[0].transactions[0].object.name,
        date : new Date(
            response.data.user[0].transactions[0].created_at.substr(0, 10)
        ),
    });
    const taskXP = response.data.user[0].transactions[0].amount;
    userData.totalXp += taskXP;

    }

    userData.xpandDate.sort((a, b) => a.date - b.date);
    userData.xpByProject.sort((a, b) => a.date - b.date);
    let lastXP = 0;
    userdata.xpandDate.forEach((task) => {
        task.xp += lastXP;
        lastXP = task.xp;
    });
};