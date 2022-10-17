import DateDropDown from '../../components/date-dropdown/DateDropdown';

(() => {
  const page = document.querySelector('.cards__date-dropdown');

  if (page) {
    const dateDropDowns = page.querySelectorAll('.js-date-dropdown');
    dateDropDowns.forEach((dateDropDown) => new DateDropDown('.js-date-dropdown', dateDropDown));
  }
})();
