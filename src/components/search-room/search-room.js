/* eslint-disable no-alert */
import './search-room.scss';

class SearchRoom {
  constructor(elem) {
    this.wrapper = elem;
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

  static _handleSearchRoomFocus(e) {
    e.currentTarget.classList.remove('js-err');
  }
}

function renderSearchRooms(selector) {
  const searchRooms = document.querySelectorAll(selector);
  searchRooms.forEach((searchRoom) => new SearchRoom(searchRoom));
}
renderSearchRooms('.js-search-room');
