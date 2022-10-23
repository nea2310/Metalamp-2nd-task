import ErrorMessage from '../error-message/ErrorMessage';
import InputField from '../input-field/InputField';
import InputEmail from '../input-email/InputEmail';

class Login {
  constructor(element, elementName = 'login') {
    this.wrapper = element;
    this.elementName = elementName;
    this.errorModifier = `${this.elementName}_error`;

    this._bindEventListeners();
    this._render();
  }

  _render() {
    const emailElement = this.wrapper.querySelector('.js-input-email');
    const passwordElement = this.wrapper.querySelector('.js-input-field');

    this.email = new InputEmail(emailElement);
    this.password = new InputField(passwordElement);

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._handleSearchRoomClick = this._handleSearchRoomClick.bind(this);
  }

  _addEventListeners() {
    this.wrapper.addEventListener('submit', this._handleLoginSubmit);
    this.errorMessageWrapper.addEventListener('click', this._handleSearchRoomClick);
  }

  _handleSearchRoomClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
  }

  _handleLoginSubmit(event) {
    const validationsResults = this.email.validateInputValue().concat(
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

export default Login;
