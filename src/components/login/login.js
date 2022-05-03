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
    // Валидация инпутов на сабмите формы
    this.wrapper.addEventListener('submit', this._handleLoginSubmit);
    // При фокусе убрать красную рамку с инпута
    this.inputs.forEach((input) => input.addEventListener('focus', Login._handleLoginFocus));
  }

  _handleLoginSubmit(e) {
    let isError = false;
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('login-error');
      } else {
        input.classList.remove('login-error');
      }
    });
    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('login-error')) {
        isError = true;
        break;
      }
    }
    if (isError) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  static _handleLoginFocus(e) {
    e.currentTarget.classList.remove('login-error');
  }
}

function renderLogins(selector) {
  const logins = document.querySelectorAll(selector);
  logins.forEach((login) => new Login(login));
}
renderLogins('.js-login');
