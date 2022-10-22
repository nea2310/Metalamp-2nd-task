import ErrorMessage from '../error-message/ErrorMessage';
import DateDropDown from '../date-dropdown/DateDropdown';
import DropDown from '../dropdown/Dropdown';
import InfoSign from '../info-sign/InfoSign';

class Booking {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this.errorModifier = `${this.elementName}_error`;
    this.day = 86400000; // 86400000 - кол-во милисекунд в сутках
    this._render();
    this._bindEventListeners();
  }

  static formatDate(dateValue) {
    const regexpDate = /^\d{2}-\d{2}-\d{4}$/;

    let date = dateValue;
    if (regexpDate.test(date) === false) {
      const dateSplit = date.split('-');
      const newDateSplit = dateSplit.map((element) => {
        const result = element.length === 1 ? `0${element}` : element;
        return result;
      });

      date = newDateSplit.join('-');
    }
    return date;
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);

    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
    this._handleBookingClick = this._handleBookingClick.bind(this);
    this._handleDateSelect = this._handleDateSelect.bind(this);
    this._handleGuestsSelect = this._handleGuestsSelect.bind(this);

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElement = this.wrapper.querySelector('.js-dropdown');
    const infoSignElements = this.wrapper.querySelectorAll('.js-info-sign');

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
    infoSignElements.forEach((element) => new InfoSign('.js-info-sign', element));

    this.dateDropDown.subscribeDateSelect(this._handleDateSelect);
    const datePlusFour = new Date(new Date().setDate(new Date().getDate() + 4));

    const formatDate = (date) => {
      const day = String(date.getDate());
      const month = String(date.getMonth() + 1);
      const dd = day.length === 1 ? `0${day}` : day;
      const mm = month.length === 1 ? `0${month}` : month;
      const yyyy = String(date.getFullYear());
      return `${yyyy}-${mm}-${dd}`;
    };

    const dateCurrentTxt = formatDate(new Date());
    const datePlusFourTxt = formatDate(datePlusFour);

    this.dateDropDown.setDate(dateCurrentTxt, datePlusFourTxt);

    this.dropDown.subscribeGuestsSelect(this._handleGuestsSelect);
    this.dropDown.setData([
      { name: 'взрослые', currentCount: 3 },
    ]);
  }

  _handleDateSelect(date) {
    if (date.length === 2) {
      this.daysAmount = (new Date(date[1]) - new Date(date[0])) / this.day;
      this._calculateCost();
    }
  }

  _handleGuestsSelect(guests) {
    const amount = (guests.match(/^\d*(?= гост)/));
    this.guestsAmount = amount ? Number(amount[0]) : 0;

    this._calculateCost();
  }

  _calculateCost() {
    function getWordForm(count) {
      let value = count;
      value = Math.abs(value) % 100;
      const number = value % 10;
      if (number > 1 && number < 20) return 'суток';
      if (number === 1) return 'сутки';
      return 'суток';
    }

    const base = this.daysAmount * this.price;
    const total = base.toFixed(0) - this._calculateDiscount().toFixed(0);
    this.days.innerText = `${this.price.toLocaleString('ru-RU')}₽ x ${this.daysAmount} ${getWordForm(this.daysAmount)}`;
    this.baseCost.innerText = `${Math.trunc(base).toLocaleString('ru-RU')}₽`;
    this.totalCost.innerText = total > 0 ? `${(Math.trunc(total) + Math.trunc(this.extra)).toLocaleString('ru-RU')}₽` : '0₽';
  }

  _calculateDiscount() {
    const result = this.discount * this.daysAmount * this.guestsAmount;
    this.service.innerText = `Сбор за услуги: скидка ${Math.trunc(result).toLocaleString('ru-RU')}₽`;
    return result;
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleBookingSubmit);
    this.errorMessageWrapper.addEventListener('click', this._handleBookingClick);
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
