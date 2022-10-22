import ErrorMessage from '../error-message/ErrorMessage';
import InputField from '../input-field/InputField';
import InputDate from '../input-date/InputDate';
import InputEmail from '../input-email/InputEmail';

class Registration {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this.errorModifier = `${this.elementName}_error`;
    this._render();
    this._bindEventListeners();
  }

  _render() {
    const nameElement = this._getElement('name').querySelector('.js-input-field');
    const surnameElement = this._getElement('surname').querySelector('.js-input-field');
    const birthDateElement = this.wrapper.querySelector('.js-input-date');
    const emailElement = this.wrapper.querySelector('.js-input-email');
    const passwordElement = this._getElement('password').querySelector('.js-input-field');

    this.name = new InputField('.js-input-field', nameElement);
    this.surname = new InputField('.js-input-field', surnameElement);
    this.birthDate = new InputDate('.js-input-date', birthDateElement);
    this.email = new InputEmail('.js-input-email', emailElement);
    this.password = new InputField('.js-input-field', passwordElement);

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._handleRegistrationSubmit = this._handleRegistrationSubmit.bind(this);
    this._handleRegistrationClick = this._handleRegistrationClick.bind(this);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleRegistrationSubmit);
    this.errorMessageWrapper.addEventListener('click', this._handleRegistrationClick);
  }

  _handleRegistrationClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
  }

  _handleRegistrationSubmit(event) {
    const validationsResults = this.name.validateInputValue().concat(
      this.surname.validateInputValue(),
      this.birthDate.validateInputValue(),
      this.email.validateInputValue(),
      this.password.validateInputValue(),
    );
    if (validationsResults.includes(false)) {
      event.preventDefault();
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, 'Заполните все поля!');
    }
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(`.js-${this.elementName}__${selector}`);
  }
}

export default Registration;
