import DateDropDown from './date-dropdown';

function renderDateDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dateDropDown) => new DateDropDown(selector, dateDropDown));
}
renderDateDropDowns('.js-date-dropdown');
