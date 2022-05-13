/* eslint-disable no-alert */
class Booking {
  constructor(element) {
    this.wrapper = element;
    this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.guests = this.wrapper.querySelector('.js-dropdown__input');
    this.inputs = this.wrapper
      .querySelectorAll('.js-dropdown__input, .js-date-dropdown__input');
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('submit', this._handleBookingSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', Booking._handleBookingFocus));
  }

  _handleBookingSubmit(e) {
    let isError = false;
    this.dates.forEach((date) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
        date.classList.remove('booking-error');
      } else {
        date.classList.add('booking-error');
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add('booking-error');
    } else {
      this.guests.classList.remove('booking-error');
    }
    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('booking-error')) {
        isError = true;
        break;
      }
    }
    if (isError) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  static _handleBookingFocus(e) {
    e.currentTarget.classList.remove('booking-error');
  }
}

function renderBookings(selector) {
  const bookings = document.querySelectorAll(selector);
  bookings.forEach((booking) => new Booking(booking));
}
renderBookings('.js-booking');
