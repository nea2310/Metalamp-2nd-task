import './booking.scss';

class Booking {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^./, '');
    this.wrapper = elem;
    this.render();
    this.focusInput();
    this.formSubmit();
  }

  render() {
    this.dates = this.wrapper.querySelectorAll('.date-dropdown__input');
    this.guests = this.wrapper.querySelector('.dropdown__input');
    this.inputs = this.wrapper
      .querySelectorAll('.dropdown__input, .date-dropdown__input');
  }

  // При фокусе убрать красную рамку с инпута
  focusInput() {
    this.inputs.forEach((date) => {
      date.addEventListener('focus', () => {
        date.classList.remove('js-err');
      });
    });
  }

  // Валидация инпутов на сабмите формы
  formSubmit() {
    this.wrapper.addEventListener('submit', (e) => {
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
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].classList.contains('js-err')) {
          isErr = true;
          break;
        }
      }
      if (isErr) {
        e.preventDefault();
        alert('Заполните все поля!');
      }
    });
  }
}

function renderBookings(selector) {
  const bookings = document.querySelectorAll(selector);
  for (const booking of bookings) {
    new Booking(selector, booking);
  }
}
renderBookings('.js-booking');
