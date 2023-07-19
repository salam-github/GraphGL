import { queryFetch } from "./fetch.js";

export async function div01CompletedTasksID() {
    try {
      const data = await queryFetch(`
        query getDiv01CompletedTasksID {
          progress {
            path
            object {
              id
            }
          }
        }
      `);
  
      if (!data.progress) {
        throw new Error('No progress data found in response');
      }
  
      const taskIDs = data.progress.map(task => task.object?.id);
  
      return taskIDs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  


  export async function getQuery() {
    const query = `
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
    const data = await queryFetch(query);
    return data;
  }