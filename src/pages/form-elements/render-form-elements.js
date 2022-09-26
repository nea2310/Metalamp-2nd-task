import DropDown from '../../components/dropdown/Dropdown';
import DateDropDown from '../../components/date-dropdown/DateDropdown';

(() => {
  const page = document.querySelector('.form-elements');

  if (page) {
    const dropDowns = page.querySelectorAll('.js-dropdown');
    dropDowns.forEach((dropDown) => new DropDown('.js-dropdown', dropDown));

    const dateDropDowns = page.querySelectorAll('.js-date-dropdown');
    dateDropDowns.forEach((dateDropDown) => new DateDropDown('.js-date-dropdown', dateDropDown));
  }
})();
