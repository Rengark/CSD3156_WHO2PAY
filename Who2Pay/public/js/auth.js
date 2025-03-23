document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Registration form handler
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
          const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            messageDiv.textContent = data.message;
            messageDiv.className = 'success';
            // Redirect to login page after successful registration
            setTimeout(() => {
              window.location.href = '/login.html';
            }, 2000);
          } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'error';
          }
        } catch (error) {
          messageDiv.textContent = 'An error occurred. Please try again.';
          messageDiv.className = 'error';
        }
      });
    }
    
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
          const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            messageDiv.textContent = data.message;
            messageDiv.className = 'success';
            // Redirect to dashboard after successful login
            window.location.href = '/dashboard';
          } else {
            messageDiv.textContent = data.message;
            messageDiv.className = 'error';
          }
        } catch (error) {
          messageDiv.textContent = 'An error occurred. Please try again.';
          messageDiv.className = 'error';
        }
      });
    }
    
    // Logout button handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function() {
        try {
          const response = await fetch('/auth/logout');
          if (response.ok) {
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      });
    }
    
    // Check authentication status
    async function checkAuthStatus() {
      try {
        const response = await fetch('/auth/status');
        const data = await response.json();
        
        if (data.isAuthenticated) {
          // User is logged in
          const usernameDisplay = document.getElementById('username-display');
          if (usernameDisplay) {
            usernameDisplay.textContent = data.user.username;
          }
          
          // If on login or register page, redirect to dashboard
          if (window.location.pathname === '/' || 
              window.location.pathname === '/login.html' || 
              window.location.pathname === '/register.html') {
            window.location.href = '/dashboard';
          }
        } else {
          // User is not logged in
          // If trying to access protected page, redirect to login
          if (window.location.pathname === '/dashboard') {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }
  });