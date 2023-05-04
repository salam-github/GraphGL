import { div01completeTasksID } from "./queries.js";

export async function drawData(userData, headers) {
    let loading = document.getElementById("loading");
    let loader = document.createElement("div");
    loader.classList.add("loader");
    loading.appendChild(loader);
    await getData(userData.login, headers);
    loading.removeChild(loader);

    let infoBox = document.getElementById("infoBox");
    let usernameBox = document.createElement("div");
    usernameBox.classList.add("usernameBox");
    usernameBox.innerText = "Username: " + userData.login + "\n" + "ID: " + userData.id;
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
    for (let task of completedTasks) {
      const taskID = task.object.id;
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
    userData.xpandDate.forEach((task) => {
        task.xp += lastXP;
        lastXP = task.xp;
    });
};

const xpOverTime = (_) => {
    let charts = document.getElementById("charts");
    let xpOverTime = document.createElement("div");
    charts.setAttribute("id", "chart1");
    charts.appendChild(xpOverTime);
    charts.appendChild(document.createElement("br"));

    // set dimensions and margins of graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        //append the svg object to the body of the page
        var svg = d3
        .select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(transform = "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        var x = d3
        .scaleTime()
        .domain(
            d3.extent(userData.xpandDate, function (d) {
                return d.date;
            })
        )
        .range([0, width]);

        svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(userData.xpandDate, function (d) {
                return +d.xp;
            }),
        ])
        .range([height, 0]);

        svg
        .append("g")
        .call(d3.axisLeft(y));
        append("text")
        .atrr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("XP");

        // Add the line
        svg
        .append("path")
        .datum(userData.xpandDate)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
            "d",
            d3
            .line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.xp);
            })
        );
};

const xpByProject = (_) => {
    let charts = document.getElementById("charts");
    let chart = document.createElement("div");
    chart.setAttribute("id", "chart2");
    charts.appendChild(chart);

    // set dimensions  and margins of the page
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
    .select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr(transform = "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> 
    var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
        userData.xpByProject.map(function (d) {
            return d.project;
        })
    )
    .padding(0.2);
    svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Add Y axis
    var y = d3
    .scaleLinear()
    .domain([0, Math.max(...userData.xpByProject.map((o) => o.xp)) + 5000])
    .range([height, 0]);

    svg
    .append("g")
    .call(d3.axisLeft(y));
    append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("XP");

    // Bars
    svg
    .selectAll("mybar")
    .data(userData.xpByProject)
    .enter()
    .append("rect")
    .attr("x", function (d) {
        return x(d.project);
    })
    .attr("y", function (d) {
        return y(d.xp);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
        return height - y(d.xp);
    })
    .attr("fill", "#69b3a2");
};