class InputField {
  constructor(element, elementName = 'input-field') {
    this.elementName = elementName;
    this.wrapper = element;

    this._bindEventListeners();
    this._render();
  }

  validateInputValue() {
    const result = /.{2,}/.test(this.input.value);
    if (!result) this.input.classList.add(`${this.elementName}__input_error`);
    else this.input.classList.remove(`${this.elementName}__input_error`);
    return [result];
  }

  _render() {
    this.input = this.wrapper.querySelector(`.js-${this.elementName}__input`);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleInputFieldFocus = this._handleInputFieldFocus.bind(this);
  }

  _addEventListeners() {
    this.input.addEventListener('focus', this._handleInputFieldFocus);
  }

  _handleInputFieldFocus() {
    this.input.classList.remove(`${this.elementName}__input_error`);
  }
}

export default InputField;
