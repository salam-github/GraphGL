
import { queryFetch } from './fetch.js';

export function loadUserData() {
    // get basic user data
    getStats();
	// getData();


  


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

	//   let percent = Math.round(
	// 	(data.user[0].totalUp / (data.user[0].totalUp + data.user[0].totalDown)) *
	// 	  100);

	// 	  let el = document.createElement("div");
	// 	  el.innerHTML += `<svg height="200 " width="200" viewBox="0 0 200 200" >
	// 	  <circle cx="100" cy="100" r="90" stroke="black" stroke-width="3" fill="white" />
	// 	  <circle cx="100" cy="100" r="90" stroke="black" stroke-width="3" fill="white" />
	// 	  stroke-dasharray="${percent} 100"
	// 	  stroke-dashoffset="25"
	// 	  stroke-width="10"
	// 	  transform="rotate(-90 100 100)" translate="0 200" />
	// 	  </svg>`;
	// 	  el.append(
	// 		createLineChart(
	// 			data.xp
	// 		)
	// 	  )
  
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
  
      // const taskIDResult = await div01CompletedTasksID;
  
      // if (taskIDResult.errors) {
      //   throw new Error(taskIDResult.errors[0].message);
      // }
      // Pass the transactions array to drawData function

      //drawData(user.login, user.firstName + " " + user.lastName, user.totalXp);

	//   totalXpAmount(xps);{
	// 	let xp_total = 0;
	// 	for (let i = 0; i < xps.length; i++) {
	// 		xp_total += xps[i];
	// 	}
	// 	return xp_total;

	  


    } catch (error) {
      console.error(error);
      const errorMessageElement = document.querySelector('#error-message');
      errorMessageElement.textContent = error.message;
    }
    
    }

    function getTechnicalSkills(data){
        const skills = [];
        data.forEach(skill => {
            if (skill.type.startsWith('skill_')) {
                const existingSkill = skills.find(
                    (s) => s.skill === skill.type.slice(6) 
                );
                if (existingSkill) {
                    existingSkill.amount += skill.amount;
                } else {
                    skills.push({
                        skill: skill.type.slice(6),
                        amount: skill.amount,
                    });
                }     
            }      
        });
        const TechnicalSkills = [];
        skills.forEach(skill => {
            if (
                skill.skill === 'prog' ||
                skill.skill === 'tcp' ||
                skill.skill === 'algo' ||
                skill.skill === 'game' ||
                skill.skill === 'back-end' ||
                skill.skill === 'front-end' ||
                skill.skill === 'sys-admin'  
                ) {    
                TechnicalSkills.push(skill);
            }
        });
        console.log('Technical Skills:', TechnicalSkills);
        return TechnicalSkills;
}

const mainDiv = document.getElementById('main');
const chart = document.getElementById('pie-chart');
const data = [
    values = [],
    labels = [],
    type = 'pie',
]
TechnicalSkills.forEach((item) => {
    data.values.push(item.amount);
    data.labels.push(item.skill);
} );
console.log('data:', data);
var layout = {