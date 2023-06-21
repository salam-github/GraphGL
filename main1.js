import { queryFetch } from './fetch.js';
import { div01CompletedTasksID, getQuery } from "./queries.js";

export function loadUserData() {
    // get basic user data
     getStats();
	//getData();


  


  }
// this function is called when the page is loaded and it calls the getStats function to get the user data
  async function getStats() {
    const Data = `
    query{
      user {
        id
        login
        campus
        lastName
        firstName
        email
        totalUp
        totalDown
        auditRatio
      }
      audits: transaction(order_by: {createdAt: asc}, where: {type: {_regex: "up|down"}}){
        type
        amount
        path
        createdAt
      }
      xp: transaction(order_by: {createdAt: asc}, where: {
        type: {_eq: "xp"}
        eventId: {_eq: 20}
      }){
        createdAt
        amount
        path
      }
      skills: transaction(order_by: {createdAt: asc}, where: {
        eventId: {_eq: 20}
      }) {
        type
        amount
        path
      }
      xpJS: transaction(order_by: {createdAt: asc}, where: {
        type: {_eq: "xp"}
        eventId: {_eq: 37}
      }) {
        createdAt
        amount
        path
      }
      xpGo: transaction(order_by: {createdAt: asc}, where: {
        type: {_eq: "xp"}
        eventId: {_eq: 2}
      }){
        createdAt
        amount
        path
      }
      xpTotal: transaction_aggregate(
        where: {
          type: {_eq: "xp"}
          eventId: {_eq: 20}
        }
      ) {aggregate {sum {amount}}}
      xpJsTotal: transaction_aggregate(
        where: {
          type: {_eq: "xp"}
          eventId: {_eq: 37}
        }
      ) {aggregate {sum {amount}}}
      xpGoTotal: transaction_aggregate(
        where: {
          type: {_eq: "xp"}
          eventId: {_eq: 2}
        }
      ) {aggregate {sum {amount}}}
    }
`;
    try {
      const data = await queryFetch(Data);
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
	  console.log('allll the Dataaaa:', data);



  
      const user = data.user[0];
      const userWelcomeElement = document.querySelector('#user-welcome');
      userWelcomeElement.innerHTML = `
        <p>Welcome, ${user.login}!</p>
        <p>Campus location: ${user.campus}.</p>
        <p>Your email is ${user.email}.</p>
        <p>XP given: ${user.totalUp}, \n XP gained ${user.totalDown}. Audit Ratio: ${user.auditRatio}</p>
  

      `;
  
      const titleElement = document.querySelector('#Title');
      titleElement.innerHTML = `
        <h3>Progress report for ${user.firstName} ${user.lastName}<h3>
      `;

      // Pass the transactions array to drawData function
      //drawData(user.login, user.firstName + " " + user.lastName, user.totalXp);
	  drawPieChart(data.audits);
	  drawHorizontalBarChart(data.skills);
	  


    } catch (error) {
      console.error(error);
      const errorMessageElement = document.querySelector('#error-message');
      errorMessageElement.textContent = error.message;
    }
    
  }
  
 export async function totalXpAmount(xps){
	let xp_total = 0;
	for (let i = 0; i < xps.length; i++) {
	xp_total += xps[i];

	}
	return xp_total;

}

function drawHorizontalBarChart(skills) {
	const selectedSkills = [
	  "skill_css",
	  "skill_front-end",
	  "skill_html",
	  "skill_js",
	  "skill_go",
	  "skill_tcp",
	  "skill_unix",
	  "skill_back-end",
	  "skill_docker",
	  "skill_sql",
	  "skill_sys-admin",
	  "skill_game",
	  "skill_algo"
	];
  
	const groupedSkills = {};
	skills.forEach(skill => {
	  if (selectedSkills.includes(skill.type)) {
		if (!groupedSkills[skill.type] || skill.amount > groupedSkills[skill.type].amount) {
		  groupedSkills[skill.type] = { type: skill.type, amount: skill.amount };
		}
	  }
	});
  
	const data = Object.values(groupedSkills);
	data.sort((a, b) => b.amount - a.amount);
  
	const chartElement = document.getElementById("chart");
  
	const chartWidth = 500;
	const chartHeight = 300;
  
	const barPadding = 10;
	const barWidth = chartWidth - 100;
	const barHeight = 20; // Define the bar height here
  
	chartElement.innerHTML = "";
  
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", chartWidth);
	svg.setAttribute("height", chartHeight);
  
	const maxValue = Math.max(...data.map(datum => datum.amount));
  
	data.forEach((datum, index) => {
	  const barLength = (datum.amount / maxValue) * barWidth;
  
	  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	  rect.setAttribute("x", 100);
	  rect.setAttribute("y", index * (barHeight + barPadding));
	  rect.setAttribute("width", barLength);
	  rect.setAttribute("height", barHeight);
	  rect.setAttribute("fill", "steelblue");
  
	  svg.appendChild(rect);
  
	  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	  text.setAttribute("x", 95);
	  text.setAttribute("y", index * (barHeight + barPadding) + barHeight / 2);
	  text.setAttribute("fill", "white");
	  text.setAttribute("text-anchor", "end");
	  text.setAttribute("alignment-baseline", "middle");
	  text.textContent = datum.amount;
  
	  svg.appendChild(text);
  
	  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
	  label.setAttribute("x", 10 + barLength + 5); // Adjust the label position here
	  label.setAttribute("y", index * (barHeight + barPadding) + barHeight / 2);
	  label.setAttribute("fill", "black");
	  label.setAttribute("text-anchor", "start");
	  label.setAttribute("alignment-baseline", "middle");
	  label.textContent = datum.type.replace(/_/g, " " + "").replace("skill", "");
  
	  svg.appendChild(label);
	});
  
	const axisRuler = document.createElementNS("http://www.w3.org/2000/svg", "line");
	axisRuler.setAttribute("x1", 100);
	axisRuler.setAttribute("y1", chartHeight);
	axisRuler.setAttribute("x2", 100);
	axisRuler.setAttribute("y2", 0);
	axisRuler.setAttribute("stroke", "black");
  
	svg.appendChild(axisRuler);
  
	chartElement.appendChild(svg);
  }
  
  

  function drawPieChart(audits) {
	// Grouping audits by type and summing the amounts
	const groupedAudits = {};
	audits.forEach(audit => {
	  const label = audit.type === "up" ? "given" : "received";
	  if (!groupedAudits[label]) {
		groupedAudits[label] = 0;
	  }
	  groupedAudits[label] += audit.amount;
	});
  
	// Creating data array for the pie chart
	const data = Object.entries(groupedAudits).map(([type, amount]) => ({ type, amount }));
  
	// Setting up chart dimensions
	const width = 450;
	const height = 470;
	const radius = Math.min(width, height) / 2;
  
	// Creating SVG element
	const svg = d3.select("#chart-container")
	  .append("svg")
	  .attr("width", width)
	  .attr("height", height)
	  .append("g")
	  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
	// Creating color scale
	const colorScale = d3.scaleOrdinal()
	  .domain(data.map(d => d.type))
	  .range(["#2ecc71", "#e74c3c"]);
  
	// Creating pie layout
	const pie = d3.pie()
	  .value(d => d.amount);
  
	// Creating arc generator
	const arc = d3.arc()
	  .innerRadius(0)
	  .outerRadius(radius);
  
	// Creating pie slices
	const slices = svg.selectAll("path")
	  .data(pie(data))
	  .enter()
	  .append("path")
	  .attr("d", arc)
	  .attr("fill", d => colorScale(d.data.type))
	  .on("mouseover", function(event, d) {
		d3.select(this)
		  .attr("transform", `translate(${arc.centroid(d)[0] * 0.1},${arc.centroid(d)[1] * 0.1})`)
		  .attr("fill", "yellow");
	  
		const hoverText = d.data ? (d.data.type === "given" ? "The amount of xp you have given to others during audits" : "The amount of xp you have gained from others during your audits") : "";
		const text = svg.append("text")
		  .attr("class", "hover-text")
		  .attr("text-anchor", "middle")
		  .attr("dy", ".35em")
		  .text(hoverText)
		  .attr("fill", "black")
		  .attr("x", 0)
		  .attr("y", 0);
	  
		// Add background and border to the hover text
		const textBoundingBox = text.node().getBBox();
		const background = svg.append("rect")
		  .attr("class", "hover-background")
		  .attr("x", textBoundingBox.x - 5)
		  .attr("y", textBoundingBox.y - 5)
		  .attr("width", textBoundingBox.width + 15)
		  .attr("height", textBoundingBox.height + 20)
		  .attr("fill", "rgba(255, 255, 255, 0.8)")
		  .attr("stroke", "black")
		  .attr("stroke-width", 1);
	  })
	  .on("mouseout", function(event, d) {
		d3.select(this)
		  .attr("transform", "translate(0,0)")
		  .attr("fill", d => colorScale(d.data.type));
		svg.selectAll(".hover-text, .hover-background").remove();
	  });
	  
	  
  
	// Adding labels to pie slices
	const labels = svg
	  .selectAll("text")
	  .data(pie(data))
	  .enter()
	  .append("text")
	  .attr("transform", d => {
		const [x, y] = arc.centroid(d);
		const translationX = isNaN(x) ? 0 : x;
		const translationY = isNaN(y) ? 0 : y;
		return `translate(${translationX}, ${translationY})`;
	  })
	  .attr("text-anchor", "middle")
	  .text(d => `${d.data.type} (${Math.round((d.data.amount / d3.sum(data, d => d.amount)) * 100)}%)`)
	  .style("fill", "white");
  
	// Adding a legend
	const legend = svg.selectAll(".legend")
	  .data(data)
	  .enter()
	  .append("g")
	  .attr("class", "legend")
	  .attr("transform", (d, i) => "translate(-50," + (i * 20 - 70) + ")");
  
	legend.append("rect")
	  .attr("x", width - 18)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", d => colorScale(d.type));
  
	legend.append("text")
	  .attr("x", width - 24)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "end")
	  .text(d => {
		if (d.type === "given") return "Given";
		if (d.type === "received") return "Received";
		return d.type;
	  });
  }
  
  









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