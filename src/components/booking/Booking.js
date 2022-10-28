import getDatePlusShift from '../../shared/utils/getDatePlusShift';
import getDateString from '../../shared/utils/getDateString';
import getWordForm from '../../shared/utils/getWordForm';
import ErrorMessage from '../error-message/ErrorMessage';
import DateDropDown from '../date-dropdown/DateDropdown';
import DropDown from '../dropdown/Dropdown';
import InfoSign from '../info-sign/InfoSign';

class Booking {
  constructor(element, elementName = 'booking') {
    this.wrapper = element;
    this.elementName = elementName;
    this.errorModifier = `${this.elementName}_error`;
    this.day = 86400000; // 86400000 - кол-во милисекунд в сутках
    this.wordForms = ['сутки', 'суток', 'суток'];

    this._bindEventListeners();
    this._render();
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElement = this.wrapper.querySelector('.js-dropdown');
    const infoSignElements = this.wrapper.querySelectorAll('.js-info-sign');

    this.days = this.wrapper.querySelector(`.js-${this.elementName}__price-base-name`);
    this.baseCost = this.wrapper.querySelector(`.js-${this.elementName}__price-base-cost`);
    this.totalCost = this.wrapper.querySelector(`.js-${this.elementName}__price-total-cost`);
    this.service = this.wrapper.querySelector(`.js-${this.elementName}__price-service-name`);
    this.priceField = this.wrapper.querySelector(`.js-${this.elementName}__detail-price`);
    this.price = Number((this.priceField).getAttribute('data-price'));
    this.discount = Number(this.service.getAttribute('data-discount'));
    this.extra = Number(this.wrapper.querySelector(`.js-${this.elementName}__price-extra-cost`).getAttribute('data-extra'));
    this.daysAmount = 0;
    this.guestsAmount = 0;

    this.dateDropDown = new DateDropDown(dateDropDownElement);
    this.dropDown = new DropDown(dropDownElement);
    infoSignElements.forEach((element) => new InfoSign(element));

    this.dateDropDown.subscribeDateSelect(this._handleDateSelect);
    const datePlusFour = getDatePlusShift(4);

    const dateCurrentTxt = getDateString(new Date(), false);
    const datePlusFourTxt = getDateString(datePlusFour, false);

    this.dateDropDown.setDate(dateCurrentTxt, datePlusFourTxt);

    this.dropDown.subscribeGuestsSelect(this._handleGuestsSelect);
    this.dropDown.setData([
      { name: 'взрослые', currentCount: 3 },
    ]);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
    this._handleBookingClick = this._handleBookingClick.bind(this);
    this._handleDateSelect = this._handleDateSelect.bind(this);
    this._handleGuestsSelect = this._handleGuestsSelect.bind(this);
  }

  _addEventListeners() {
    this.wrapper.addEventListener('submit', this._handleBookingSubmit);
    this.errorMessageWrapper.addEventListener('click', this._handleBookingClick);
  }

  _handleDateSelect(date) {
    this.daysAmount = 0;
    if (date) {
      this.daysAmount = (new Date(date[1]) - new Date(date[0])) / this.day;
    }
    this._calculateCost();
  }

  _handleGuestsSelect(guests) {
    let amount = 0;
    if (guests) { amount = (guests.match(/^\d*(?= гост)/)); }
    this.guestsAmount = amount ? Number(amount[0]) : 0;

    this._calculateCost();
  }

  _calculateCost() {
    const base = this.daysAmount * this.price * this.guestsAmount;
    const total = base.toFixed(0) - this._calculateDiscount().toFixed(0);
    this.days.innerText = `${(this.price * this.guestsAmount).toLocaleString('ru-RU')}₽ x ${this.daysAmount} ${getWordForm(this.daysAmount, this.wordForms)}`;
    this.priceField.innerText = `${(this.price * this.guestsAmount).toLocaleString('ru-RU')}₽`;
    this.baseCost.innerText = `${Math.trunc(base).toLocaleString('ru-RU')}₽`;
    this.totalCost.innerText = total > 0 ? `${(Math.trunc(total) + Math.trunc(this.extra)).toLocaleString('ru-RU')}₽` : '0₽';
  }

  _calculateDiscount() {
    const result = this.discount * this.daysAmount * this.guestsAmount;
    this.service.innerText = `Сбор за услуги: скидка ${Math.trunc(result).toLocaleString('ru-RU')}₽`;
    return result;
  }

  _handleBookingClick(event) {
    event.preventDefault();
    this._hideErrorMessageWrapper();
  }

  _handleBookingSubmit(event) {
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

export default Booking;
