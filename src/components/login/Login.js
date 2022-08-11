class Login {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.inputs = this.wrapper.querySelectorAll('input');
    this.message = this.wrapper.querySelector(`.js-${this.elementName}__message`);
    this._handleLoginSubmit = this._handleLoginSubmit.bind(this);
    this._handleLoginFocus = this._handleLoginFocus.bind(this);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleLoginSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleLoginFocus));
  }

  _handleLoginSubmit(e) {
    e.preventDefault();
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add(`${this.elementName}_error`);
      } else {
        input.classList.remove(`${this.elementName}_error`);
      }
    });

    const isError = Array.from(this.inputs).some((item) => item.classList.contains(`${this.elementName}_error`));

    if (isError) {
      e.preventDefault();
      this._toggleMessage();
    }
  }

  _toggleMessage(isError = true) {
    if (isError) {
      this.message.classList.add('login__message_active');
      return;
    }
    this.message.classList.remove('login__message_active');
  }

  _handleLoginFocus(e) {
    e.currentTarget.classList.remove('login_error');
    this._toggleMessage(false);
  }
}

export default Login;
