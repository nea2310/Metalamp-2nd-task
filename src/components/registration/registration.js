/* eslint-disable no-alert */
class Registration {
  constructor(element) {
    this.wrapper = element;
    this._handleRegistrationSubmit = this._handleRegistrationSubmit.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.date = this.wrapper.querySelector('.js-input-field_validation_date input');
    this.inputs = this.wrapper
      .querySelectorAll('input');
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleRegistrationSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', Registration._handleRegistrationFocus));
  }

  _handleRegistrationSubmit(e) {
    let isError = false;
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('registration-error');
      } else {
        input.classList.remove('registration-error');
      }
    });
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
      this.date.classList.remove('registration-error');
    } else {
      this.date.classList.add('registration-error');
    }

    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('registration-error')) {
        isError = true;
        break;
      }
    }
    if (isError) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  static _handleRegistrationFocus(e) {
    e.currentTarget.classList.remove('registration-error');
  }
}

function renderRegistrations(selector) {
  const registrations = document.querySelectorAll(selector);
  registrations.forEach((registration) => new Registration(registration));
}
renderRegistrations('.js-registration');
