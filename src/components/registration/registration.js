/* eslint-disable no-alert */
import './registration.scss';

class Registration {
  constructor(elem) {
    this.wrapper = elem;
    this._handleRegistrationSubmit = this._handleRegistrationSubmit.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.date = this.wrapper.querySelector('.js-masked');
    this.inputs = this.wrapper
      .querySelectorAll('input');
  }

  _bindEventListeners() {
    // Валидация инпутов на сабмите формы
    this.wrapper.addEventListener('submit', this._handleRegistrationSubmit);
    // При фокусе убрать красную рамку с инпута
    this.inputs.forEach((input) => input.addEventListener('focus', Registration._handleRegistrationFocus));
  }

  _handleRegistrationSubmit(e) {
    let isErr = false;
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('js-err');
      } else {
        input.classList.remove('js-err');
      }
    });
    // проверку на формат даты обязательно делать ПОСЛЕ проверки на заполненность поля
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
      this.date.classList.remove('js-err');
    } else {
      this.date.classList.add('js-err');
    }

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

  static _handleRegistrationFocus(e) {
    e.currentTarget.classList.remove('js-err');
  }
}

function renderRegistrations(selector) {
  const registrations = document.querySelectorAll(selector);
  registrations.forEach((registration) => new Registration(registration));
}
renderRegistrations('.js-registration');
