class Registration {
  constructor(element) {
    this.wrapper = element;
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.date = this.wrapper.querySelector('.js-input-field_validation_date input');
    this.inputs = this.wrapper.querySelectorAll('input');
    this.message = this.wrapper.querySelector('.js-registration__message');
    this._handleRegistrationSubmit = this._handleRegistrationSubmit.bind(this);
    this._handleRegistrationFocus = this._handleRegistrationFocus.bind(this);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleRegistrationSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleRegistrationFocus));
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

    const isError = Array.from(this.inputs).some((item) => item.classList.contains('registration_error'));
    if (isError) {
      e.preventDefault();
      this._toggleMessage();
    }
  }

  _toggleMessage(isError = true) {
    if (isError) {
      this.message.classList.add('registration__message_active');
      return;
    }
    this.message.classList.remove('registration__message_active');
  }

  _handleRegistrationFocus(e) {
    e.currentTarget.classList.remove('registration_error');
    this._toggleMessage(false);
  }
}

function renderRegistrations(selector) {
  const registrations = document.querySelectorAll(selector);
  registrations.forEach((registration) => new Registration(registration));
}
renderRegistrations('.js-registration');
