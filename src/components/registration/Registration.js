import getElement from '../../shared/utils/getElement';
import ErrorMessage from '../error-message/ErrorMessage';
import InputField from '../input-field/InputField';
import InputDate from '../input-date/InputDate';
import InputEmail from '../input-email/InputEmail';

class Registration {
  constructor(element, elementName = 'registration') {
    this.wrapper = element;
    this.elementName = elementName;
    this.errorModifier = `${this.elementName}_error`;

    this._bindEventListeners();
    this._render();
  }

  _render() {
    const nameElement = getElement('name', this.wrapper, this.elementName).querySelector('.js-input-field');
    const surnameElement = getElement('surname', this.wrapper, this.elementName).querySelector('.js-input-field');
    const birthDateElement = this.wrapper.querySelector('.js-input-date');
    const emailElement = this.wrapper.querySelector('.js-input-email');
    const passwordElement = getElement('password', this.wrapper, this.elementName).querySelector('.js-input-field');

    this.name = new InputField(nameElement);
    this.surname = new InputField(surnameElement);
    this.birthDate = new InputDate(birthDateElement);
    this.email = new InputEmail(emailElement);
    this.password = new InputField(passwordElement);

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleRegistrationSubmit = this._handleRegistrationSubmit.bind(this);
    this._handleRegistrationClick = this._handleRegistrationClick.bind(this);
  }

  _addEventListeners() {
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
}

export default Registration;
