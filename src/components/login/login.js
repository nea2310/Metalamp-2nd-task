/* eslint-disable no-alert */
import './login.scss';

class Login {
  constructor(elemName, elem) {
    this.elemName = elemName;
    this.wrapper = elem;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.render();
    this.formSubmit();
  }

  render() {
    this.form = this.wrapper
      .querySelector(`${this.elemName}__login-form`);
    this.inputs = this.wrapper
      .querySelectorAll('input');
  }

  handleSubmit(e) {
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

  // Валидация инпутов на сабмите формы
  formSubmit() {
    this.form.addEventListener('submit', this.handleSubmit);
  }
}

function renderLogins(selector) {
  const logins = document.querySelectorAll(selector);
  logins.forEach((login) => new Login(selector, login));
}
renderLogins('.js-login');
