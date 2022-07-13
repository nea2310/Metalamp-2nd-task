/* eslint-disable no-alert */
class Login {
  constructor(element) {
    this.wrapper = element;
    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.inputs = this.wrapper
      .querySelectorAll('input');
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleLoginSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', Login._handleLoginFocus));
  }

  _handleLoginSubmit(e) {
    e.preventDefault();
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('login_error');
      } else {
        input.classList.remove('login_error');
      }
    });

    const isError = Array.from(this.inputs).some((item) => item.classList.contains('login_error'));

    if (isError) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  static _handleLoginFocus(e) {
    e.currentTarget.classList.remove('login_error');
  }
}

function renderLogins(selector) {
  const logins = document.querySelectorAll(selector);
  logins.forEach((login) => new Login(login));
}
renderLogins('.js-login');
