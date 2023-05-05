
// const limit = 50;
// const fetchUrl = 'https://01.gritlab.ax/api/graphql-engine/v1/graphql';

export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const secure = location.protocol === 'https:' ? 'Secure;' : '';
    const sameSite = 'SameSite=Lax;';
    document.cookie = name + "=" + value + ";" + expires + ";" + secure + sameSite + "path=/";
}
function getToken() {
    const cookieString = document.cookie;
    console.log("Cookie string:", cookieString);
    const cookieArray = cookieString.split('; ');
    let token;
    cookieArray.forEach((cookie) => {
      const [name, value] = cookie.split('=');
      if (name === 'token') {
        token = value;
      }
    });
  
    console.log("Token from cookies:", token);
    return token;
  }

  export async function queryFetch(query, variables) {
    const token = getToken();
    if (!token) {
      throw new Error('No token found in cookies');
    }
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
    console.log("Response:", res);
    const result = await res.json();
    console.log("Result:", result);
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    if (!result.data) {
      throw new Error('No data found in response');
    }
    return result.data;
  }
  

// https://01.gritlab.ax/api/auth/signin

// Define your GraphQL query
