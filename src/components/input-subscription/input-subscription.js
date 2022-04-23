/* eslint-disable no-alert */
class InputSubscribe {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^./, '');
    this.input = element;
    this.inputWrapper = this.input.parentNode;
    this._handleInputSubscriptionChange = this._handleInputSubscriptionChange.bind(this);
    this._handleInputSubscriptionClick = this._handleInputSubscriptionClick.bind(this);
    this._render();
    this._bindEventListeners();
  }

  static testEmail(value) {
    const test = /.+@.+\..+/i.test(value);
    if (value && !test) {
      alert(`Введенный e-mail ${value} имеет некорректный формат`);
    }
  }

  _render() {
    this.link = this.inputWrapper.querySelector('button');
  }

  _bindEventListeners() {
    this.input.addEventListener('change', this._handleInputSubscriptionChange);
    if (this.link) {
      this.link.addEventListener('click', this._handleInputSubscriptionClick);
    }
  }

  _handleInputSubscriptionChange() {
    InputSubscribe.testEmail(this.input.value);
  }

  _handleInputSubscriptionClick() {
    InputSubscribe.testEmail(this.input.value);
  }
}

function renderInputsSubscribe(selector) {
  const inputsSubscribe = document.querySelectorAll(selector);
  inputsSubscribe.forEach((inputMask) => new InputSubscribe(selector, inputMask));
}
renderInputsSubscribe('.js-check-email');
