class homePage extends HTMLElement {
  constructor() {
    super();
    this.loadUserData();
  }

  async loadUserData() {
    const jwt = localStorage.getItem("jwt");
    const decodedJwt = this.decodeJwt(jwt);
    let response;
    response = await this.getQuery(decodedJwt.sub, jwt);
    localStorage.setItem("skills", JSON.stringify(response.data.skills));
    this.render(response.data);
  }


  async getQuery(id, jwt) {
    const query = `
    query {
        user(where: {id: {_eq: ${id}}}) {
          login
          firstName
          lastName
          auditRatio
          totalUp
          totalDown
        }
        audits: transaction(order_by: {createdAt: asc}, where: {type: {_regex: "up|down"}}) {
          type
          amount
          path
          createdAt
        }
          xp: transaction(order_by: {createdAt: asc}, where: {
          type: {_eq: "xp"}
            eventId: {_eq: 20}
        }) {
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
        }) {
                createdAt
            amount
                path
          }
        xpTotal : transaction_aggregate(
        where: {
          userId: {_eq: ${id}}
          type: {_eq: "xp"}
          eventId: {_eq: 20}
        }
      ) {aggregate {sum {amount}}}
        xpJsTotal : transaction_aggregate(
        where: {
          userId: {_eq: ${id}}
          type: {_eq: "xp"}
          eventId: {_eq: 37}
        }
      ) {aggregate {sum {amount}}}
        xpGoTotal : transaction_aggregate(
        where: {
          userId: {_eq: ${id}}
          type: {_eq: "xp"}
          eventId: {_eq: 2}
        }
      ) {aggregate {sum {amount}}}
      }`;
    const response = await fetch(
      "https://01.gritlab.ax/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    return data;
  }
  catch(error) {
    throw new Error("Failed to fetch data from GraphQL API");
  }

  decodeJwt(jwt) {
    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const result = JSON.parse(decoded);
    return result;
  }

  totalXPAmount(xps) {
    let xp_total = 0;
    for (let i = 0; i < xps.length; i++) {
      xp_total += xps[i].amount;
    }
    return xp_total;
  }

  randomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  logOut(event) {
    localStorage.removeItem("jwt");
    location.reload();
  }

  

  connectedCallback() {
    this.addEventListener("click", this.logOut);
  }
  disconnectedCallback() {}

  render(data) {
  this.innerHTML =
    `<div class="container"
      <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
          <div class="col-md-7 p-lg-5 mx-auto my-1">
              <h1 class="display-5 font-weight-normal">Basic Information</h1>
              <p class="lead font-weight-normal">Name: 
                ${data.user[0].firstName} ${data.user[0].lastName}
              </p>
              <p class="lead font-weight-normal">Username: ${
                data.user[0].login
              }</p>
              <p class="lead font-weight-normal">Audit Ratio: ${Number(
                data.user[0].auditRatio.toFixed(1)
              )}</p>
              <p class="lead font-weight-normal">Total XP: ${Math.round(
                data.xpTotal.aggregate.sum.amount / 1000
              )} kB</p>
          </div>
          <button id="logout-btn" class="btn btn-lg w-25 mx-auto btn-primary btn-block" type="button">Log Out</button>
      </div>

      <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-dark">
          
              
                  <p class="lead text-white">Audits Ratio</p>
          
                  <svg width="400" height="150">
                  <!-- Done bar -->
                  <rect x="0" y="25" width="${Math.round(
                    data.user[0].totalUp / 10000
                  )}" height="50" fill="#0074D9"/>
                  <text x="0" y="20" fill="#FFFFFF" font-size="14">Done: </text>
                  <text x="50" y="20" fill="#FFFFFF" font-size="14">${Math.round(
                    data.user[0].totalUp / 1000
                  )} kB</text>

                  <rect x="50" y="75" width="220" height="10" fill="#353A35"/>

                  <!-- Received bar -->
                  <rect x="0" y="105" width="${Math.round(
                    data.user[0].totalDown / 10000
                  )}" height="50" fill="#FF4136"/>
                  <text x="0" y="100" fill="#FFFFFF" font-size="14">Received: </text>
                  <text x="70" y="100" fill="#FFFFFF" font-size="14">${Math.round(
                    data.user[0].totalDown / 1000
                  )} kB</text>
                  </svg>
                  <h3 class="display-4 text-white">${Number(
                    data.user[0].auditRatio.toFixed(1)
                  )}</h3>

            
              
          
  </div>
  </div>
