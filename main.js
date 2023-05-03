import { getId } from "./queries";
import { drawData, userData } from "./user";

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
            await drawData(userID.login, userID.id);
            loading = false;
        }
    }
});