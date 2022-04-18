/* eslint-disable no-alert */
import './login.scss';

class Login {
  constructor(elem) {
    this.wrapper = elem;
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

  static _handleLoginFocus(e) {
    e.currentTarget.classList.remove('js-err');
  }
}

function renderLogins(selector) {
  const logins = document.querySelectorAll(selector);
  logins.forEach((login) => new Login(login));
}
renderLogins('.js-login');
