class InputField {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._init();
    this._bindEventListeners();
    this._addEventListeners();
  }

  validate() {
    const result = /.{2,}/.test(this.input.value);
    if (!result) this.input.classList.add(`${this.elementName}__input_error`);
    else this.input.classList.remove(`${this.elementName}__input_error`);
    return [result];
  }

  _init() {
    this.input = this.wrapper.querySelector(`.js-${this.elementName}__input`);
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
