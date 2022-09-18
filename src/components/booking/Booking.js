import ErrorMessage from '../error-message/ErrorMessage';
import DateDropDown from '../date-dropdown/DateDropdown';
import DropDown from '../dropdown/Dropdown';

class Booking {
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

    this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
    this._handleBookingFocus = this._handleBookingFocus.bind(this);
    this._handleBookingClick = this._handleBookingClick.bind(this);
    this._handleDateSelect = this._handleDateSelect.bind(this);
    this._handleGuestsSelect = this._handleGuestsSelect.bind(this);

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElement = this.wrapper.querySelector('.js-dropdown');

    this.days = this.wrapper.querySelector(`.js-${this.elementName}__price-base-name`);
    this.baseCost = this.wrapper.querySelector(`.js-${this.elementName}__price-base-cost`);
    this.totalCost = this.wrapper.querySelector(`.js-${this.elementName}__price-total-cost`);
    this.service = this.wrapper.querySelector(`.js-${this.elementName}__price-service-name`);

    this.price = Number(this.wrapper.querySelector(`.js-${this.elementName}__detail-price`).getAttribute('data-price'));
    this.discount = Number(this.service.getAttribute('data-discount'));
    this.extra = Number(this.wrapper.querySelector(`.js-${this.elementName}__price-extra-cost`).getAttribute('data-extra'));
    this.daysAmount = 0;
    this.guestsAmount = 0;

    this.dateDropDown = new DateDropDown('.js-date-dropdown', dateDropDownElement);
    this.dropDown = new DropDown('.js-dropdown', dropDownElement);

    this.dateDropDown.subscribeDateSelect(this._handleDateSelect);
    this.dropDown.subscribeGuestsSelect(this._handleGuestsSelect);
  }

  _handleDateSelect(date) {
    if (date.length === 2) {
      // 86400000 - кол-во милисекунд в сутках
      this.daysAmount = (new Date(date[1]) - new Date(date[0])) / 86400000;
      this._calculateCost();
    }
  }

  _handleGuestsSelect(guests) {
    const amount = (guests.match(/^\d*(?= гост)/));
    this.guestsAmount = amount ? Number(amount[0]) : 0;

    this._calculateCost();
  }

  _calculateCost() {
    const base = this.daysAmount * this.guestsAmount * this.price;
    const total = base - this._calculateDiscount() + this.extra;
    this.days.innerText = `${this.price.toLocaleString('ru-RU')}₽ x ${this.daysAmount} суток`;
    this.baseCost.innerText = `${Math.trunc(base).toLocaleString('ru-RU')}₽`;
    this.totalCost.innerText = total > 0 ? `${Math.trunc(total).toLocaleString('ru-RU')}₽` : '0₽';
  }

  _calculateDiscount() {
    const result = this.discount * this.daysAmount;
    this.service.innerText = `Сбор за услуги: скидка ${Math.trunc(result).toLocaleString('ru-RU')}₽`;
    return result;
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleBookingSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleBookingFocus));
    this.errorMessageWrapper.addEventListener('click', this._handleBookingClick);
  }

  _handleBookingClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
    this.inputs.forEach((input) => input.classList.remove(this.errorModifier));
  }

  _handleBookingSubmit(event) {
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

  _handleBookingFocus(event) {
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

export default Booking;
