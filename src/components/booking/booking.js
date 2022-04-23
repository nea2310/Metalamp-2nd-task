/* eslint-disable no-alert */
import './booking.scss';

class Booking {
  constructor(element) {
    this.wrapper = element;
    this._handleBookingSubmit = this._handleBookingSubmit.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.dates = this.wrapper.querySelectorAll('.date-dropdown__input');
    this.guests = this.wrapper.querySelector('.dropdown__input');
    this.inputs = this.wrapper
      .querySelectorAll('.dropdown__input, .date-dropdown__input');
  }

  _bindEventListeners() {
    // Валидация инпутов на сабмите формы
    this.wrapper.addEventListener('submit', this._handleBookingSubmit);
    // При фокусе убрать красную рамку с инпута
    this.inputs.forEach((input) => input.addEventListener('focus', Booking._handleBookingFocus));
  }

  _handleBookingSubmit(e) {
    let isError = false;
    this.dates.forEach((date) => {
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(date.value)) {
        date.classList.remove('js-error');
      } else {
        date.classList.add('js-error');
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add('js-error');
    } else {
      this.guests.classList.remove('js-error');
    }
    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('js-error')) {
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
    e.currentTarget.classList.remove('js-error');
  }
}

function renderBookings(selector) {
  const bookings = document.querySelectorAll(selector);
  bookings.forEach((booking) => new Booking(booking));
}
renderBookings('.js-booking');
