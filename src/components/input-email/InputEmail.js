import ErrorMessage from '../error-message/ErrorMessage';

class InputEmail {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.regexp = /.+@.+\..+/i;

    this._init();
    this._bindEventListeners();
    this._addEventListeners();
  }

  validate() {
    const result = this.regexp.test(this.input.value);
    if (!result) this.input.classList.add(`${this.elementName}__input_error`);
    else this.input.classList.remove(`${this.elementName}__input_error`);
    return [result];
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
    this._handleInputFieldFocus = this._handleInputFieldFocus.bind(this);
  }

  _addEventListeners() {
    this.input.addEventListener('change', this._handleInputFieldChange);
    this.input.addEventListener('focus', this._handleInputFieldFocus);
    if (this.link) {
      this.link.addEventListener('click', this._handleInputFieldClick);
    }
  }

  _handleInputFieldFocus() {
    this.input.classList.remove(`${this.elementName}__input_error`);
  }

  _handleInputFieldChange() {
    this._checkEmail(this.input.value);
  }

  _handleInputFieldClick() {
    this._checkEmail(this.input.value);
  }

  _checkEmail(value) {
    const test = this.regexp.test(value);
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
