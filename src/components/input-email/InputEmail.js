import ErrorMessage from '../error-message/ErrorMessage';

class InputEmail {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this._init();
    this._bindEventListeners();
    this._addEventListeners();
  }

  _init() {
    this.input = this.wrapper.querySelector(`.js-${this.elementName}__input`);

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);
    this.link = this.wrapper.querySelector(`${this.elementName}__link`);
  }

  _bindEventListeners() {
    this._handleInputFieldChange = this._handleInputFieldChange.bind(this);
    this._handleInputFieldClick = this._handleInputFieldClick.bind(this);
  }

  _addEventListeners() {
    this.input.addEventListener('change', this._handleInputFieldChange);
    if (this.link) {
      this.link.addEventListener('click', this._handleInputFieldClick);
    }
  }

  _handleInputFieldChange() {
    this._checkEmail(this.input.value);
  }

  _handleInputFieldClick() {
    this._checkEmail(this.input.value);
  }

  _checkEmail(value) {
    const test = /.+@.+\..+/i.test(value);
    if (value && !test) {
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, `Введенный e-mail ${value} имеет некорректный формат`);
    } else {
      this._hideErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage();
    }
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }
}

export default InputEmail;
