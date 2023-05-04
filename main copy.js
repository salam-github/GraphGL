import { getId } from "./queries.js";
import { drawData, userData } from "./user.js";

let loading = false;

let btn = document.getElementById("searchBtn");
btn.addEventListener("click", async () => {
    let userID = await getId(document.getElementById("searchInput").value);
    if (userID == undefined) {
        removeGraphs();
        window.alert("User not found");
    } else {
        if (!loading) {
            loading = true;
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            await drawData(userID.login, userID.id, headers);
            loading = false;
        }
    }
});