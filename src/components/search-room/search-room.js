import './search-room.scss';

class SearchRoom {
  constructor(elemName, elem) {
    // this.elemName = elemName.replace(/^./, '');
    this.wrapper = elem;
    this.render();
    this.focusInput();
    this.formSubmit();
  }

  render() {
    this.dates = this.wrapper.querySelectorAll('.js-date-dropdown__input');
    this.guests = this.wrapper.querySelector('.js-dropdown__input');
    this.inputs = this.wrapper
      .querySelectorAll('.js-dropdown__input, .js-date-dropdown__input');
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

function renderSearchRooms(selector) {
  const searchRooms = document.querySelectorAll(selector);
  for (const searchRoom of searchRooms) {
    new SearchRoom(selector, searchRoom);
  }
}
renderSearchRooms('.js-search-room');
