/* eslint-disable no-alert */
import './search-room.scss';

class SearchRoom {
  constructor(element) {
    this.wrapper = element;
    this._handleSearchRoomSubmit = this._handleSearchRoomSubmit.bind(this);
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
    // Валидация инпутов на сабмите формы
    this.wrapper.addEventListener('submit', this._handleSearchRoomSubmit);
    // При фокусе убрать красную рамку с инпута
    this.inputs.forEach((input) => input.addEventListener('focus', SearchRoom._handleSearchRoomFocus));
  }

  _handleSearchRoomSubmit(e) {
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

  static _handleSearchRoomFocus(e) {
    e.currentTarget.classList.remove('js-error');
  }
}

function renderSearchRooms(selector) {
  const searchRooms = document.querySelectorAll(selector);
  searchRooms.forEach((searchRoom) => new SearchRoom(searchRoom));
}
renderSearchRooms('.js-search-room');
