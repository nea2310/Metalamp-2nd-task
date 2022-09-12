class ErrorMessage {
  constructor(element) {
    this.elementName = 'error-message';
    this.wrapper = element;
    this._render();
    this._bindEventListeners();
  }

  toggleErrorMessage(isError = false, message = '') {
    if (isError) {
      this.errorMessage.classList.add(`${this.elementName}_active`);
      if (message) {
        this.errorMessageText.innerHTML = message;
      }
      return;
    }

    this.errorMessage.classList.remove(`${this.elementName}_active`);
  }

  _render() {
    this.errorMessage = this.wrapper.querySelector(`.js-${this.elementName}`);
    this.errorMessageText = this.wrapper.querySelector(`.js-${this.elementName}__text`);
    this.errorMessageCloseButton = this.wrapper.querySelector(`.js-${this.elementName}__close-button`);
    this._handleErrorMessageClick = this._handleErrorMessageClick.bind(this);
  }

  _bindEventListeners() {
    this.errorMessageCloseButton.addEventListener('click', this._handleErrorMessageClick);
  }

  _handleErrorMessageClick() {
    this.toggleErrorMessage(false);
  }
}

export default ErrorMessage;
