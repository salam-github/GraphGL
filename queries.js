import { queryFetch } from "./fetch";

export async function getId(userId) {
    const data = await queryFetch(
        `
        query getID($userId: String!) {
            user(where: {login: {_eq: $user}}) {
                id,
                login
            }
        }
        `,
        {user: userId}
    );
    return data.data.user[0]
}

export async function div01completeTasksID(username) {
    const data = await queryFetch(
    `
    query getDiv01CompleteTasksID($username: String!) {
        user(where: {login: {_eq: $username}}) {
            login
            progress(where: {_and: [{path: {_iregx: "div-01/(?!piscine.js.*/)"} _and: {path: {_iregx: "div-01/(?!rust)"}}}, {isDone: {_eq: true}}]}) {
                path
                object{
                    id
                }
            }
        }
    } `,
    {username: username}
    );
    return data;
}