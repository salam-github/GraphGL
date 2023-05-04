import { queryFetch } from './fetch.js';

const userDataContainer = document.querySelector('#user-data-container');
const logoutButton = document.querySelector('#logout-button');

async function loadUserData() {
  const query = `
    query {
      user(where: {login: {_eq: $user}}) {
        id
        login
      }
    }
  `;
  const variables = { userId: localStorage.getItem('userId') };

  try {
      const response = await queryFetch(query, variables);
      const userData = response.data.user[0];
      userDataContainer.innerHTML = `
          <p>Name: ${userData.id}</p>
          <p>Email: ${userData.login}</p>
          // add any other fields you want to display here
      `;
  } catch (error) {
      console.error(error);
      userDataContainer.innerHTML = '<p>Error loading user data</p>';
  }
}


function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.replace('login.html');
}
loadUserData();

logoutButton.addEventListener('click', handleLogout);