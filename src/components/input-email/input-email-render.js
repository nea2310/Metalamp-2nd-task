import InputEmail from './InputEmail';

function renderInputsEmail(selector) {
  const inputEmails = document.querySelectorAll(selector);
  inputEmails.forEach((inputEmail) => new InputEmail(selector, inputEmail));
}
renderInputsEmail('.js-input-email');
