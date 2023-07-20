const loginForm = document.querySelector('#login-form');
const message = document.querySelector('#message');
    
loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
    const username = loginForm.username.value;
    const password = loginForm.password.value;
  
    try {
    const response = await fetch('https://01.gritlab.ax/api/auth/signin', {
      method: 'POST',
      headers: {
          'Authorization': 'Basic ' + btoa(username + ':' + password)
      }
  });
  
  if (response.ok) {
    console.log("response ok", response)
  
      const data = await response.json();
    console.log("data", data)
      console.log(data);
      document.cookie = `token=${data}; path=/;`;
      localStorage.setItem('token', data);
  
      // Redirect to home page and store cookie
      const homeUrl = 'https://salam-github.github.io/GraphGL/home.html';
      const url = new URL(homeUrl, window.location.origin);
      url.searchParams.set('token', data.token);
      window.location.href = url.toString();
  } else {
      throw new Error('Invalid credentials');
  }
  
    } catch (error) {
      message.innerHTML = error.message;
    }
  });