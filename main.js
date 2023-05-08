import { queryFetch } from './fetch.js';
//import { drawData, userData } from './drawdata.js';


//await drawData()
// const uid = data1

export function init() {
    // get basic user data
    getID();
    getStat();
  
    // get Tx btn
    const btnManager = document.getElementById("btnManager");
    btnManager.addEventListener("click", getTx);
  
    // add id fetch callback
      //resetUX()
      clearGraph()
      getUserData()
      getStat()
      this.focus()

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
  
    try {
      //console.log('Token before fetch:', token);
      const currentUserresult = await queryFetch(currentUser);
      //console.log('Result2:', currentUserresult);
      if (currentUserresult.errors) {
        throw new Error(currentUserresult.errors[0].message);
      }
  
      //print currentuser data to page
      //console.log('Result111:',currentUserresult["user"], "data",currentUserresult[0]);
      const user = currentUserresult["user"][0];
      const userwelcomeElement = document.querySelector('#user-welcome');
      userwelcomeElement.innerHTML = `
      <p>Welcome, ${user.login}!</p>
      <p>Your school ID is ${user.id}.</p>
      `;      
      const TitleElement = document.querySelector('#Title');
      TitleElement.innerHTML = `
      <h3>Progress report for ${user.login}<h3>
      `;
  
  
    } catch (error) {
      console.error(error);
      const errorMessageElement = document.querySelector('#error-message');
      errorMessageElement.textContent = error.message;
    }
  }

  //xp query
  async function getStat(tx = [], offset = 0) {
    const fragment = `
      fragment getData on user {
          id
          login
          transactions (
              order_by:{createdAt:desc}
              offset:${offset}
          )
          {
              amount
              type
              path
              object {
                  type
                  name
              }
          }
      }
      `;
  
    await queryFetch( {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ query: `${fetch}${fragment}` }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        if (json.error || !json.data.user.transactions.length) throw new Error(`cannot access to user ${variables.uid}`)
  
        tx = tx.concat(json.data.user.transactions);
        if (json.data.user.transactions.length === limit) {
          getStat(tx, tx.length);
        } else {
          return tx;
        }
      })
      .then((tx) => {
        if (!tx) return;
  
        // cache all stats to stats Map
        const stats = new Map();
        const ups = tx
          .filter((entry) => entry.type === "up")
          .reduce((acc, cur) => acc + cur.amount, 0);
        const downs = tx
          .filter((entry) => entry.type === "down")
          .reduce((acc, cur) => acc + cur.amount, 0);
        stats.set("Audit ratio", ups / downs);
        stats.set(
          "School-curriculum XP",
          tx
            .filter((entry) => {
              if (
                (entry.amount >= 5000 &&
                  entry.type === "xp" &&
                  !(entry.object.type === "exercise") &&
                  entry.path.startsWith("/gritlab/school-curriculum")) ||
                (entry.path.includes("checkpoint") && entry.type === "xp")
              ) {
                return true;
              }
            })
            .reduce((acc, cur) => acc + cur.amount, 0)
        );
        stats.set(
          "Piscine-go XP",
          tx
            .filter((entry) => {
              if (
                entry.type === "xp" &&
                entry.path.startsWith("/gritlab/piscine-go")
              ) {
                return true;
              }
            })
            .reduce((acc, cur) => acc + cur.amount, 0)
        );
        stats.set(
          "Piscine-js XP",
          tx
            .filter((entry) => {
              if (
                entry.type === "xp" &&
                entry.path.startsWith("/gritlab/school-curriculum/piscine-js/")
              ) {
                return true;
              }
            })
            .reduce((acc, cur) => acc + cur.amount, 0)
        );
        stats.set(
          "School-curriculum level",
          tx.filter(entry => entry.type === "level" && entry.object.type === "project")?.reduce((max, cur) => max = cur.amount > max.amount ? cur : max, { amount: 0 })?.amount
        );
        console.log()
        stats.set(
          "Piscine-go level",
          tx.filter((entry) => entry.type === "level" && entry.path.startsWith("/gritlab/piscine-go"))?.reduce((max, cur) => max = cur.amount > max.amount ? cur : max, { amount: 0 })?.amount
        );
        stats.set(
          "Piscine-js level",
          tx.filter((entry) => entry.type === "level" && entry.path.startsWith("/gritlab/school-curriculum/piscine-js/"))?.reduce((max, cur) => max = cur.amount > max.amount ? cur : max, { amount: 0 })?.amount,
        );
        const skills = new Map();
        tx.filter((entry) => entry.type.includes("skill")).map((entry) => {
          const skill = entry.type.split("_")[1];
          skills.has(skill)
            ? skills.set(skill, Math.max(entry.amount, skills.get(skill)))
            : skills.set(skill, entry.amount);
        });
        stats.set("Skills", skills);
        // make DOM element
        const statsDom = document.getElementById("stats");
        statsDom.innerHTML = ""
        stats.forEach((stat, key) => {
          if (!stat) return
          let statText =
            Number.isFinite(stat) && stat < 1 ? stat.toFixed(2) : stat;
          if (Object.getPrototypeOf(stat) === Map.prototype) {
            const statSelect = document.createElement("select");
            statSelect.id = "statSelect";
            stat.forEach((value, skill) => {
              const item = document.createElement("option");
              item.textContent = skill;
              item.value = value;
              statSelect.append(item);
            });
            statsDom.innerHTML += `
                  <tr>
                  <td>${key} ${statSelect.outerHTML}:</td>
                  <td><span id="skillLevel">${statSelect.children[0].value}</span></td>
                  </tr>
                  `;
            document
              .getElementById("statSelect")
              .addEventListener("change", function () {
                document.getElementById("skillLevel").textContent = this.value;
              });
          } else {
            statsDom.innerHTML += `
                  <tr>
                      <td>${key}:</td>
                      <td>${statText}</td>
                  </tr>
                  `;
          }
        });
      }).catch(e => {
        document.getElementById("stats").innerHTML = e.message.includes("cannot access to user") ? e.message : "user does not exist"
        document.getElementById("get-xp-btn").disabled = true
        document.getElementById("get-level-btn").disabled = true
      })
  }

// progresses (where: {_and: [{path: {_iregex: "div-01/(?!piscine-js.*/)"} _and: {path: {_iregex: "div-01/(?!rust)"}}}, {isDone: {_eq: true}}]})
export async function completedTasks(username) {
    const data = await queryFetch(`
    query completedTasks {
        user {
          login
          progresses   {
            path
            object {
              id
            }
          }
        }
      }
    `);
 

}
async function getTx(e) {
    e.preventDefault();
  
    const valueType = e.target.dataset.value;
    const orderType = e.target.dataset.order;
    const projType = "project";
    const xpCorrection = valueType === "xp" ? `{amount:{_gte:5000}}` : ``;
    const txParam = `
      transactions (
          where:{
          _and:[
              {type:{_eq:"${valueType}"}}
              {path:{_gt:"/gritlab/school-curriculum/"}}
              {object:{type:{_eq:"${projType}"}}}
              ${xpCorrection}
              ]
          }
          order_by:{${orderType}:desc}
          offset: 0
      )
      `;
    const txReturnValues = `
      {
          createdAt
          amount
          type
          path
          object {
              name
              type
          }
      }
      `;
    const fragment = `
      fragment getData on user {
          login
          ${txParam}
          ${txReturnValues}
      }`;
  
    await fetch(fetchURL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ query: `${query}${fragment}`, variables }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        const graphqlResult = document.getElementById("graphqlResult");
        graphqlResult.innerHTML = `${json.data.user.login}'s project ${valueType} progress (last ${json.data.user.transactions.length} changes)`;
        drawGraph(json.data.user.transactions, valueType);
      });
  }
  
  async function drawGraph(tx, type) {
    if (!tx.length) {
      alert(`user ${variables.uid} does not have ${type} progress`)
      return
    }
    // graph config
    const canvas = document.getElementById("canvas");
    const canvasWidth = 90;
    const canvasHeight = 70;
  
    // set tooltip pos
    const tooltip = document.getElementById("tooltip");
    const canvasPos = canvas.getBoundingClientRect()
    tooltip.style.top = canvasPos.top + 10 + "px"
    tooltip.style.left = canvasPos.left + 40 + "px"
      
    // calculate time lapse and stat
    const firstDate = new Date(tx.at(-1).createdAt);
    const lastDate = new Date(tx.at(0).createdAt);
    const timeLapse = Date.parse(lastDate) - Date.parse(firstDate);
    const entries = tx.length;
    const maxValue =
      type === "xp"
        ? tx.reduce((acc, cur) => acc + cur.amount, 0)
        : tx.at(0).amount;
  
    // update axis text
    const xAxisText = document.getElementById("xAxisText");
    const yAxisText = document.getElementById("yAxisText");
    xAxisText.textContent = `${firstDate.getDate()}/${firstDate.getMonth()}/${firstDate.getFullYear()} to ${lastDate.getDate()}/${lastDate.getMonth()}/${lastDate.getFullYear()} `;
    yAxisText.textContent = `0 to ${maxValue} ${type}`;
  
    // initialize path
    const path = document.getElementById("path");
    path.setAttribute("d", "M5 75");
    let pathD = path.getAttribute("d");
    let pathX = 5;
    let pathY = canvasHeight + 5;
  
    // clean last graph cache
    clearGraph();
  
    for (let i = entries - 1; i >= 0; i--) {
      if (i === entries - 1) {
        pathX = 5;
        pathY = canvasHeight + 5;
      } else if (i === 0) {
        // put last tx at the top right
        pathX = canvasWidth + 5;
        pathY = 5;
      } else {
        // otherwise put them proportionally to time
        const xIncrement =
          canvasWidth *
          ((Date.parse(tx[i + 1].createdAt) - Date.parse(tx[i].createdAt)) /
            timeLapse);
        const yIncrement =
          type === "level"
            ? canvasHeight / entries
            : (tx.at(i).amount / maxValue) * canvasHeight;
        pathX -= xIncrement;
        pathY -= yIncrement;
      }
      pathD += ` L${pathX} ${pathY}`;
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", pathX);
      circle.setAttribute("cy", pathY);
      circle.setAttribute("r", "0.5");
      circle.setAttribute("fill", "lightblack");
      canvas.append(circle);
  
      const division = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      division.setAttribute("cx", pathX);
      division.setAttribute("cy", pathY);
      division.setAttribute("r", "3");
      division.setAttribute("fill", "transparent");
      division.dataset.xPos = pathX;
      division.dataset.yPos = pathY;
      canvas.append(division);
  
      division.addEventListener("mouseover", function (e) {
        const indicator = document.getElementById("indicator");
        indicator.setAttribute("cx", e.target.dataset.xPos);
        indicator.setAttribute("cy", e.target.dataset.yPos);
        indicator.setAttribute("fill", "black");
  
        tooltip.classList.remove("hidden");
        document.getElementById("tooltip-amount").innerHTML = `${type}: ${tx.at(i).amount
          }`;
        document.getElementById("tooltip-event").innerHTML = tx.at(i).object.name;
        document.getElementById("tooltip-date").innerHTML = new Date(
          tx.at(i).createdAt
        ).toDateString();
      });
      canvas.append(division);
    }
    if (type === "xp") {
      pathD += ` L95 75`
      path.setAttribute("fill", "darkgrey")
    }
    path.setAttribute("d", pathD);
  }
  
  function clearGraph() {
    const canvas = document.getElementById("canvas");
    const circles = canvas.querySelectorAll("circle");
    for (let j = circles.length - 1; j >= 0; j--) {
      if (!circles[j].id) canvas.removeChild(circles[j]);
    }
    document.getElementById("tooltip").classList.add("hidden");
    document.getElementById("indicator").setAttribute("fill", "transparent");
    document.getElementById("tooltip-amount").textContent = "";
    document.getElementById("tooltip-event").textContent = "";
    document.getElementById("tooltip-date").textContent = "";
    const path = document.getElementById("path");
    path.setAttribute("d", "M5 75");
    path.setAttribute("fill", "transparent")
  }
  
















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