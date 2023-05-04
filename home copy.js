import { queryFetch } from './fetch.js';

const userDataContainer = document.querySelector('#user-data-container');
const logoutButton = document.querySelector('#logout-button');

async function loadUserData() {
  const query = `
    query getId($userId: String!) {
      user(where: {login: {_eq: $user}}) {
        id
        login
      }
    }
  `;
  const variables = {};

  try {
    const response = await queryFetch(query, variables);

    if (!response.data.user) {
      throw new Error('User not found');
    }

    // Display the user data in the container element
    const userData = response.data.user[0];
    userDataContainer.innerHTML = `
      <p>Name: ${userData.id}</p>
      <p>Email: ${userData.login}</p>
    `;
  } catch (error) {
    console.error(error);
    userDataContainer.innerHTML = `<p>Error loading user data</p>`;
  }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.replace('login.html');
}

loadUserData();

logoutButton.addEventListener('click', handleLogout);
