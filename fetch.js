
const limit = 50;
const fetchUrl = 'https://01.gritlab.ax/api/graphql-engine/v1/graphql';


export async function queryFetch(query, variables) {
    const token = localStorage.getItem('token');
    const res = await fetch(
        'https://01.gritlab.ax/api/graphql-engine/v1/graphql',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
        }
    );
    return await res.json();
}

// https://01.gritlab.ax/api/auth/signin