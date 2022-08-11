import Login from './login';

function renderLogins(selector) {
  const logins = document.querySelectorAll(selector);
  logins.forEach((login) => new Login(selector, login));
}
renderLogins('.js-login');
