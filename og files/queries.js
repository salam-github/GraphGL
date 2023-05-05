import { queryFetch } from "./fetch.js";

export async function getUserInfo() {
    const data = await queryFetch(
      `
      query getUserInfo {
        user(where: {login: {_eq: "USER_LOGIN"}}) {
          id
          login
          xp
          grades {
            id
            grade
            cursus {
              id
              name
            }
          }
        }
      }
      `,
      {},
      localStorage.getItem("token") // Add token to headers
    );
    if (data.data.user.length > 0) {
      return data.data.user[0];
    } else {
      return undefined;
    }
  }

export async function div01completeTasksID(username) {
    const data = await queryFetch(
    `
    query getDiv01CompleteTasksID($username: String!) {
        user(where: {login: {_eq: $username}}) {
            login
            progresses(where: {_and: [{path: {_iregex: "div-01/(?!piscine.js.*/)"} _and: {path: {_iregex: "div-01/(?!rust)"}}}, {isDone: {_eq: true}}]}) {
                path
                object{
                    id
                }
            }
        }
    } `,
    {username: username},
    localStorage.getItem('token') // Add token to headers
    );
    return data;
}
