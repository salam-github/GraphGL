export async function queryFetch(query, variables) {
    const res = await fetch(
        'https://01.gritlab.ax/api/graphql-engine/v1/graphql',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
        }
    );
    return await res.json();
}