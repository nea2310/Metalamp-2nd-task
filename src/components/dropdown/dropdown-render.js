import DropDown from './Dropdown';

function renderDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dropDown) => new DropDown(selector, dropDown));
}

export default renderDropDowns;
