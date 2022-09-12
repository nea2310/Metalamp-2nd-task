import ErrorMessage from '../error-message/ErrorMessage';

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
