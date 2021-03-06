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
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('registration_error');
      } else {
        input.classList.remove('registration_error');
      }
    });
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
      this.date.classList.remove('registration_error');
    } else {
      this.date.classList.add('registration_error');
    }

    const isError = this.inputs.some((item) => item.classList.contains('login-error'));
    if (isError) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  static _handleRegistrationFocus(e) {
    e.currentTarget.classList.remove('registration_error');
  }
}

function renderRegistrations(selector) {
  const registrations = document.querySelectorAll(selector);
  registrations.forEach((registration) => new Registration(registration));
}
renderRegistrations('.js-registration');
