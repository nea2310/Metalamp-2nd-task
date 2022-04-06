/* eslint-disable no-alert */
class InputSubscribe {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^./, '');
    this.input = elem;
    this.inputWrapper = this.input.parentNode;
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.render();
    this.init();
  }

  static testEmail(value) {
    const test = /.+@.+\..+/i.test(value);
    if (value && !test) {
      alert(`Введенный e-mail ${value} имеет некорректный формат`);
    }
  }

  render() {
    this.link = this.inputWrapper.querySelector('button');
  }

  handleChange() {
    InputSubscribe.testEmail(this.input.value);
  }

  handleClick() {
    InputSubscribe.testEmail(this.input.value);
  }

  init() {
    this.input.addEventListener('change', this.handleChange);
    if (this.link) {
      this.link.addEventListener('click', this.handleClick);
    }
  }
}

function renderInputsSubscribe(selector) {
  const inputsSubscribe = document.querySelectorAll(selector);
  inputsSubscribe.forEach((inputMask) => new InputSubscribe(selector, inputMask));
}
renderInputsSubscribe('.js-check-email');
