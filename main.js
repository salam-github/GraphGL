import { queryFetch } from './fetch.js';
import { div01CompletedTasksID, div01TaskXP } from "./queries.js";


//await drawData()
// const uid = data1

export function init() {
    // get basic user data
    getID();
    //drawData()
    //getStat()


  
    // add id fetch callback
      //resetUX()
      //clearGraph()
      //getUserData()
      //this.focus()

  }

  async function getID() {
    const currentUser = `
    query {
        user {
            id
            login
        }
    }
`;
    const div01CompletedTasksID = `
      query {
        progress {
          object {
            id
          }
        }
      }
    `;
  
    try {
      const currentUserResult = await queryFetch(currentUser);
      const userLogin = currentUserResult.user[0]; // Extract the login name from the query result
      const taskID = await queryFetch(div01CompletedTasksID);
      const response = await div01TaskXP(userLogin, taskID);
      console.log(response);
  
      if (currentUserResult.errors) {
        throw new Error(currentUserResult.errors[0].message);
      }
  
      const user = currentUserResult.user[0];
      const userWelcomeElement = document.querySelector('#user-welcome');
      userWelcomeElement.innerHTML = `
        <p>Welcome, ${user.login}!</p>
        <p>Your school ID is ${user.id}.</p>
      `;
  
      const titleElement = document.querySelector('#Title');
      titleElement.innerHTML = `
        <h3>Progress report for ${user.login}<h3>
      `;
  
      const div01CompletedTasksIDResult = await div01CompletedTasksID;
  
      if (div01CompletedTasksIDResult.errors) {
        throw new Error(div01CompletedTasksIDResult.errors[0].message);
      }
  
      const taskIDs = taskIDResult.data.progress.map(task => task.object.id);
  
      for (const taskID of taskIDs) {
        const div01TaskXPResult = await div01TaskXP(user.login, taskID);
        if (div01TaskXPResult.errors) {
          throw new Error(div01TaskXPResult.errors[0].message);
        }
        const task = div01TaskXPResult.transaction[0];
        const taskElement = document.createElement('li');
        taskElement.textContent = `${task.object.name} - ${task.amount} XP`;
        const taskListElement = document.querySelector('#task-list');
        taskListElement.appendChild(taskElement);
      }
  
      // Pass the transactions array to getStat function
      //getStat(user.transactions, user.login, user.id);
      getData(user.login, userData);
      drawData(user.login, user.id);
      //getStat(user.transactions, user.login, user.id);
    } catch (error) {
      console.error(error);
      const errorMessageElement = document.querySelector('#error-message');
      errorMessageElement.textContent = error.message;
    }
  }
  
  
  

  //example of how to use the data
  function getStat(transactions, login, id) {
    //Do something with the transactions, login, and id
    //console.log(transactions);
    console.log(login);
    console.log(id);
    // console.log('Function 1:');
    // console.log(loginName);
    // console.log(userID);
  }

export async function drawData(login, id) {
	// let loading = document.getElementById("loading");
	// let loader = document.createElement("div");
	// loader.classList.add("loader");
	// loading.appendChild(loader);
	//await getData(login);

	let infoBoxes = document.getElementById("infoBoxes");
	let usernameBox = document.createElement("div");
	usernameBox.classList.add("box");
	usernameBox.innerText = "Username: " + login + "\n" + "ID: " + id;
	infoBoxes.appendChild(usernameBox);

	let xpBox = document.createElement("div");
	xpBox.classList.add("box");
	let lvl = calculateLevel(userData.totalXp);
	xpBox.innerText =
		"Level: " +
		lvl +
		"\n" +
		"XP: " +
		Math.round(userData.totalXp / 1000) +
		"kB";
	infoBoxes.appendChild(xpBox);

	xpOverTimeChart();
	xpByProjectChart();
}

export let userData = { 
    totalXp: 0,
    xpAndDate: [],
    xpByProject: [],

};

function calculateLevel(xp) {
	let level = 0;

	while (levelNeededXP(++level) < xp) {}

	return level - 1;
}


function levelNeededXP(level) {
	return Math.round(level * (176 + 3 * level * (47 + 11 * level)));
}

// const user = currentUserResult.user[0];
// const userWelcomeElement = document.querySelector('#user-welcome');
// userWelcomeElement.innerHTML = `
//   <p>Welcome, ${user.login}!</p>
//   <p>Your school ID is ${user.id}.</p>
// `;


let getData = async (login, userData) => {
  try {
    let response = await div01CompletedTasksID();
    console.log('Completed Tasks Response:', response); // Log the response object for debugging purposes

    if (!response || !response.progress || response.progress.length === 0) {
      console.error('Invalid response data:', response); // Log the response data for debugging purposes
      throw new Error('Invalid response data');
    }

    const progress = response.progress;
    console.log('Progress:', progress); // Log the progress array for debugging purposes

    const completedTasks = progress.map(task => task.object.id);
    console.log('Completed Tasks:', completedTasks); // Log the completed tasks array for debugging purposes

    for (let completedTask of completedTasks) {
      const taskID = completedTask;
      response = await div01TaskXP(login, taskID);
      console.log('Task XP Response:', response); // Log the response object for debugging purposes

      if (
        !response.data ||
        !response.data.user ||
        !response.data.user[0].transactions ||
        response.data.user[0].transactions.length === 0
      ) {
        throw new Error('Invalid response data');
      }

      userData.xpAndDate.push({
        xp: response.data.user[0].transactions[0].amount,
        date: new Date(
          response.data.user[0].transactions[0].createdAt.substr(0, 10)
        ),
      });

      userData.xpByProject.push({
        xp: response.data.user[0].transactions[0].amount,
        project: response.data.user[0].transactions[0].object.name,
        date: new Date(
          response.data.user[0].transactions[0].createdAt.substr(0, 10)
        ),
      });

      const taskXP = response.data.user[0].transactions[0].amount;
      userData.totalXp += taskXP;
    }

    userData.xpAndDate.sort((a, b) => a.date - b.date);
    userData.xpByProject.sort((a, b) => a.date - b.date);
    let lastXp = 0;
    userData.xpAndDate.forEach((task) => {
      task.xp += lastXp;
      lastXp = task.xp;
    });
  } catch (error) {
    console.error(error);
    const errorMessageElement = document.querySelector('#error-message');
    errorMessageElement.textContent = error.message;
  }
};








const xpOverTimeChart = (_) => {
	let charts = document.getElementById("graphs");
	let chart = document.createElement("div");
	chart.setAttribute("id", "chart1");
	charts.appendChild(chart);
	charts.appendChild(document.createElement("br"));

	// set the dimensions and margins of the graph
	var margin = { top: 10, right: 30, bottom: 30, left: 60 },
		width = 800 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3
		.select("#chart1")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Add X axis --> it is a date format
	var x = d3
		.scaleTime()
		.domain(
			d3.extent(userData.xpAndDate, function (d) {
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
			d3.max(userData.xpAndDate, function (d) {
				return +d.xp;
			}),
		])
		.range([height, 0]);
	svg
		.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("TOTAL XP");

	// Add the line
	svg
		.append("path")
		.datum(userData.xpAndDate)
		.attr("fill", "none")
		.attr("stroke", "#0b7dda")
		.attr("stroke-width", 5)
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

const xpByProjectChart = (_) => {
	let charts = document.getElementById("graphs");
	let chart = document.createElement("div");
	chart.setAttribute("id", "chart2");
	charts.appendChild(chart);

	// set the dimensions and margins of the graph
	var margin = { top: 30, right: 30, bottom: 130, left: 60 },
		width = 800 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3
		.select("#chart2")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// X axis
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
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3
		.scaleLinear()
		.domain([0, Math.max(...userData.xpByProject.map((o) => o.xp)) + 5000])
		.range([height, 0]);
	svg
		.append("g")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("fill", "#000")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("PROJECT XP");

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
		.attr("fill", "#0b7dda");
};
  








  // Logout Function
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
  logout();
  });
  
  async function logout() {
      try {
          await fetch('https://01.gritlab.ax/api/auth/signout', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
      } catch (error) {
          console.error(error);
          } finally {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              localStorage.removeItem('token');
              window.location.assign('login.html');
          }
  }
  
      //getID();
    //   getStat();
      //completedTasks();