import ErrorMessage from '../error-message/ErrorMessage';

class Login {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this.errorModifier = `${this.elementName}_error`;
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.inputs = this.wrapper.querySelectorAll('input');
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);

    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._handleLoginFocus = this._handleLoginFocus.bind(this);
    this._handleSearchRoomClick = this._handleSearchRoomClick.bind(this);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleLoginSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleLoginFocus));
    this.errorMessageWrapper.addEventListener('click', this._handleSearchRoomClick);
  }

  _handleSearchRoomClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
    this.inputs.forEach((input) => input.classList.remove(this.errorModifier));
  }

  _handleLoginSubmit(event) {
    event.preventDefault();
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add(this.errorModifier);
      } else {
        input.classList.remove(this.errorModifier);
      }
    });

    const isError = Array.from(this.inputs).some(
      (item) => item.classList.contains(this.errorModifier),
    );

    if (isError) {
      event.preventDefault();
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, 'Заполните все поля!');
    }
  }

  _handleLoginFocus(event) {
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

export default Login;
