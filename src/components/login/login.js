/* eslint-disable no-alert */
import './login.scss';

class Login {
  constructor(elemName, elem) {
    this.elemName = elemName;
    this.wrapper = elem;
    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.form = this.wrapper
      .querySelector(`${this.elemName}__login-form`);
    this.inputs = this.wrapper
      .querySelectorAll('input');
  }

  // Валидация инпутов на сабмите формы
  _bindEventListeners() {
    this.form.addEventListener('submit', this._handleLoginSubmit);
  }

  _handleLoginSubmit(e) {
    let isErr = false;
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('js-err');
      } else {
        input.classList.remove('js-err');
      }
    });
    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('js-err')) {
        isErr = true;
        break;
      }
    }
    if (isErr) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }
}

function renderLogins(selector) {
  const logins = document.querySelectorAll(selector);
  logins.forEach((login) => new Login(selector, login));
}
renderLogins('.js-login');
