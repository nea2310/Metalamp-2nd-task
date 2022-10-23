class ErrorMessage {
  constructor(element, focusElement = null, callback = null, elementName = 'error-message') {
    this.elementName = elementName;
    this.wrapper = element;
    this.focusElement = focusElement;
    this.callback = callback;
    this._render();
    this._bindEventListeners();
  }

  toggleErrorMessage(isError = false, message = '') {
    if (isError) {
      this.errorMessage.classList.add(`${this.elementName}_active`);
      this.errorMessageCloseButton.focus();
      if (message) {
        this.errorMessageText.innerHTML = message;
      }
      return;
    }

    this.errorMessage.classList.remove(`${this.elementName}_active`);
    if (this.focusElement) {
      this.focusElement.focus();
    }
    if (this.callback) {
      this.callback();
    }
  }

  _render() {
    this.errorMessage = this.wrapper.querySelector(`.js-${this.elementName}`);
    this.errorMessageText = this.wrapper.querySelector(`.js-${this.elementName}__text`);
    this.errorMessageCloseButton = this.wrapper.querySelector(`.js-${this.elementName}__close-button`);
    this._handleErrorMessageClick = this._handleErrorMessageClick.bind(this);
    this._handleErrorMessageKeydown = this._handleErrorMessageKeydown.bind(this);
  }

  _bindEventListeners() {
    this.errorMessageCloseButton.addEventListener('click', this._handleErrorMessageClick);
    this.errorMessageCloseButton.addEventListener('keydown', this._handleErrorMessageKeydown);
  }

  _handleErrorMessageClick() {
    this.toggleErrorMessage(false);
  }

  _handleErrorMessageKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Enter') {
      this.toggleErrorMessage(false);
    }
  }
}

export default ErrorMessage;
