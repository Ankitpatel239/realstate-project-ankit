(() => {
  'use strict';

  const form = document.querySelector('#loginForm');
  const password = document.querySelector('#password');
  const togglePassword = document.querySelector('#togglePassword');
  const message = document.querySelector('#formMessage');
  const year = document.querySelector('#year');

  if (year) year.textContent = String(new Date().getFullYear());

  if (togglePassword && password) {
    togglePassword.addEventListener('click', () => {
      const show = password.type === 'password';
      password.type = show ? 'text' : 'password';
      togglePassword.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      togglePassword.setAttribute('aria-pressed', String(show));
    });
  }

  const forgotPassword = document.querySelector('#forgotPassword');
  if (forgotPassword && message) {
    forgotPassword.addEventListener('click', () => {
      message.textContent = 'Password recovery is managed by your organization. Please contact your workspace administrator.';
    });
  }

  if (form && message) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      message.textContent = 'Sign-in is not connected yet. You can explore the dashboard demo using the link below.';
    });
  }
})();
