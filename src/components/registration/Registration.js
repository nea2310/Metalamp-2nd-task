class Registration {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.date = this.wrapper.querySelector('.js-input-field_validation_date input');
    this.inputs = this.wrapper.querySelectorAll('input');
    this.message = this.wrapper.querySelector(`.js-${this.elementName}__message`);
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
        input.classList.add(`${this.elementName}_error`);
      } else {
        input.classList.remove(`${this.elementName}_error`);
      }
    });
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
      this.date.classList.remove(`${this.elementName}_error`);
    } else {
      this.date.classList.add(`${this.elementName}_error`);
    }

    const isError = Array.from(this.inputs).some((item) => item.classList.contains(`${this.elementName}_error`));
    if (isError) {
      e.preventDefault();
      this._toggleMessage();
    }
  }

  _toggleMessage(isError = true) {
    if (isError) {
      this.message.classList.add(`${this.elementName}__message_active`);
      return;
    }
    this.message.classList.remove(`${this.elementName}__message_active`);
  }

  _handleRegistrationFocus(e) {
    e.currentTarget.classList.remove(`${this.elementName}_error`);
    this._toggleMessage(false);
  }
}

export default Registration;
