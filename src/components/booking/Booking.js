class Booking {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.guests = this.wrapper.querySelector('.js-dropdown__input');
    this.inputs = this.wrapper.querySelectorAll('.js-dropdown__input, .js-date-dropdown__input');
    this.message = this.wrapper.querySelector(`.js-${this.elementName}__message`);
    this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
    this._handleBookingFocus = this._handleBookingFocus.bind(this);
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleBookingSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', this._handleBookingFocus));
  }

  _handleBookingSubmit(e) {
    this.dates.forEach((date) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
        date.classList.remove(`${this.elementName}_error`);
      } else {
        date.classList.add(`${this.elementName}_error`);
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add(`${this.elementName}_error`);
    } else {
      this.guests.classList.remove(`${this.elementName}_error`);
    }

    const isError = Array.from(this.inputs).some((item) => item.classList.contains(`${this.elementName}_error`));
    if (isError) {
      e.preventDefault();
      this._toggleMessage();
    }
  }

  _toggleMessage(isError = true) {
    if (isError) {
      this.message.classList.add(`${this.elementName}__message_active`);
      return;
    }
    this.message.classList.remove(`${this.elementName}__message_active`);
  }

  _handleBookingFocus(e) {
    e.currentTarget.classList.remove(`${this.elementName}_error`);
    this._toggleMessage(false);
  }
}

export default Booking;
