import InputField from './InputField';

function renderInputsMask(selector) {
  const inputFields = document.querySelectorAll(selector);
  inputFields.forEach((inputMask) => new InputField(selector, inputMask));
}
renderInputsMask('.js-input-field');
