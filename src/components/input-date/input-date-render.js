/* eslint-disable no-unused-vars */
import InputDate from './InputDate';

function renderInputsDate(selector) {
  const inputDates = document.querySelectorAll(selector);
  inputDates.forEach((inputDate) => new InputDate(selector, inputDate));
}
// renderInputsDate('.js-input-date');
