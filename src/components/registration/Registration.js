import ErrorMessage from '../error-message/ErrorMessage';

class Registration {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this.errorModifier = `${this.elementName}_error`;
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.date = this.wrapper.querySelector('.js-input-field_validation_date input');
    this.inputs = this.wrapper.querySelectorAll('input');
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);

    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._handleRegistrationSubmit = this._handleRegistrationSubmit.bind(this);
    this._handleRegistrationFocus = this._handleRegistrationFocus.bind(this);
    this._handleRegistrationClick = this._handleRegistrationClick.bind(this);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleRegistrationSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleRegistrationFocus));
    this.errorMessageWrapper.addEventListener('click', this._handleRegistrationClick);
  }

  _handleRegistrationClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
    this.inputs.forEach((input) => input.classList.remove(this.errorModifier));
  }

  _handleRegistrationSubmit(event) {
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add(this.errorModifier);
      } else {
        input.classList.remove(this.errorModifier);
      }
    });
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
      this.date.classList.remove(this.errorModifier);
    } else {
      this.date.classList.add(this.errorModifier);
    }

    const isError = Array.from(this.inputs).some(
      (item) => item.classList.contains(this.errorModifier),
    );
    if (isError) {
      event.preventDefault();
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, 'Заполните все поля!');
    }
  }

  _handleRegistrationFocus(event) {
    event.currentTarget.classList.remove(this.errorModifier);
    this._hideErrorMessageWrapper();
    this.errorMessage.toggleErrorMessage();
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }
}

export default Registration;
