import ErrorMessage from '../error-message/ErrorMessage';
import DateDropDown from '../date-dropdown/DateDropdown';
import DropDown from '../dropdown/Dropdown';

class SearchRoom {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this.errorModifier = `${this.elementName}_error`;
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.guests = this.wrapper.querySelector('.js-dropdown__input');
    this.inputs = this.wrapper.querySelectorAll('.js-dropdown__input, .js-date-dropdown__input');
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);

    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._handleSearchRoomSubmit = this._handleSearchRoomSubmit.bind(this);
    this._handleSearchRoomFocus = this._handleSearchRoomFocus.bind(this);
    this._handleSearchRoomClick = this._handleSearchRoomClick.bind(this);

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElement = this.wrapper.querySelector('.js-dropdown');

    this.dateDropDown = new DateDropDown('.js-date-dropdown', dateDropDownElement);
    this.dropDown = new DropDown('.js-dropdown', dropDownElement);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleSearchRoomSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleSearchRoomFocus));
    this.errorMessageWrapper.addEventListener('click', this._handleSearchRoomClick);
  }

  _handleSearchRoomClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
    this.inputs.forEach((input) => input.classList.remove(this.errorModifier));
  }

  _handleSearchRoomSubmit(event) {
    this.dates.forEach((date) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
        date.classList.remove(this.errorModifier);
      } else {
        date.classList.add(this.errorModifier);
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add(this.errorModifier);
    } else {
      this.guests.classList.remove(this.errorModifier);
    }

    const isError = Array.from(this.inputs).some(
      (item) => item.classList.contains(this.errorModifier),
    );

    if (isError) {
      event.preventDefault();
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, 'Заполните все поля!');
    }
  }

  _handleSearchRoomFocus(event) {
    event.currentTarget.classList.remove(this.errorModifier);
    this._hideErrorMessageWrapper();
    this.errorMessage.toggleErrorMessage();
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }
}

export default SearchRoom;
