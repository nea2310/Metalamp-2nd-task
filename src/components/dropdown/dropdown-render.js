import DropDown from './dropdown';

function _renderDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dropDown) => new DropDown(selector, dropDown));
}
_renderDropDowns('.js-dropdown');
