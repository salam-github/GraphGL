import { queryFetch } from "./fetch.js";

export async function getId(userId) {
    const data = await queryFetch(
        `
        query getID($user: String!) {
            user(where: {login: {_eq: $user}}) {
                id,
                login
            }
        }
        `,
        {user: userId},
        localStorage.getItem('token') // Add token to headers
    );
    return data.data.user[0];
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
