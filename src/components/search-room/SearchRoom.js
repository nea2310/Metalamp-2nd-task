import ErrorMessage from '../error-message/ErrorMessage';
import DateDropDown from '../date-dropdown/DateDropdown';
import DropDown from '../dropdown/Dropdown';

class SearchRoom {
  constructor(element, elementName = 'search-room') {
    this.wrapper = element;
    this.elementName = elementName;
    this.errorModifier = `${this.elementName}_error`;
    this._bindEventListeners();
    this._render();
  }

  _render() {
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElement = this.wrapper.querySelector('.js-dropdown');

    this.dateDropDown = new DateDropDown(dateDropDownElement);
    this.dropDown = new DropDown(dropDownElement);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleSearchRoomSubmit = this._handleSearchRoomSubmit.bind(this);
    this._handleSearchRoomClick = this._handleSearchRoomClick.bind(this);
  }

  _addEventListeners() {
    this.wrapper.addEventListener('submit', this._handleSearchRoomSubmit);
    this.errorMessageWrapper.addEventListener('click', this._handleSearchRoomClick);
  }

  _handleSearchRoomClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
  }

  _handleSearchRoomSubmit(event) {
    const validationsResults = this.dateDropDown.validateInputValue().concat(
      this.dropDown.validateInputValue(),
    );
    if (validationsResults.includes(false)) {
      event.preventDefault();
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, 'Заполните все поля!');
    }
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }
}

export default SearchRoom;
