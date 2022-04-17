/* eslint-disable no-alert */
import './booking.scss';

class Booking {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^./, '');
    this.wrapper = elem;
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
  }

  _handleBookingSubmit(e) {
    let isErr = false;
    this.dates.forEach((date) => {
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(date.value)) {
        date.classList.remove('js-err');
      } else {
        date.classList.add('js-err');
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add('js-err');
    } else {
      this.guests.classList.remove('js-err');
    }
    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('js-err')) {
        isErr = true;
        break;
      }
    }
    if (isErr) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }
}

function renderBookings(selector) {
  const bookings = document.querySelectorAll(selector);
  bookings.forEach((booking) => new Booking(selector, booking));
}
renderBookings('.js-booking');
