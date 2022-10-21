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
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);

    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._handleSearchRoomSubmit = this._handleSearchRoomSubmit.bind(this);
    this._handleSearchRoomClick = this._handleSearchRoomClick.bind(this);

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElement = this.wrapper.querySelector('.js-dropdown');

    this.dateDropDown = new DateDropDown('.js-date-dropdown', dateDropDownElement);
    this.dropDown = new DropDown('.js-dropdown', dropDownElement);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleSearchRoomSubmit);
    this.errorMessageWrapper.addEventListener('click', this._handleSearchRoomClick);
  }

  _handleSearchRoomClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
  }

  _handleSearchRoomSubmit(event) {
    const validationsResults = this.dateDropDown.validate().concat(this.dropDown.validate());
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
