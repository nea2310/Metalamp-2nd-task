class Booking {
  constructor(element) {
    this.wrapper = element;
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.guests = this.wrapper.querySelector('.js-dropdown__input');
    this.inputs = this.wrapper.querySelectorAll('.js-dropdown__input, .js-date-dropdown__input');
    this.message = this.wrapper.querySelector('.js-booking__message');
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
        date.classList.remove('booking_error');
      } else {
        date.classList.add('booking_error');
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add('booking_error');
    } else {
      this.guests.classList.remove('booking_error');
    }

    const isError = Array.from(this.inputs).some((item) => item.classList.contains('booking_error'));
    if (isError) {
      e.preventDefault();
      this._toggleMessage();
    }
  }

  _toggleMessage(isError = true) {
    if (isError) {
      this.message.classList.add('booking__message_active');
      return;
    }
    this.message.classList.remove('booking__message_active');
  }

  _handleBookingFocus(e) {
    e.currentTarget.classList.remove('booking_error');
    this._toggleMessage(false);
  }
}

function renderBookings(selector) {
  const bookings = document.querySelectorAll(selector);
  bookings.forEach((booking) => new Booking(booking));
}
renderBookings('.js-booking');
