/* eslint-disable no-alert */
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
    this.wrapper.addEventListener('submit', this._handleSearchRoomSubmit);
    this.inputs.forEach((input) => input.addEventListener('focus', SearchRoom._handleSearchRoomFocus));
  }

  _handleSearchRoomSubmit(e) {
    this.dates.forEach((date) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date.value)) {
        date.classList.remove('search-room-error');
      } else {
        date.classList.add('search-room-error');
      }
    });
    if (this.guests.value.trim() === '') {
      this.guests.classList.add('search-room-error');
    } else {
      this.guests.classList.remove('search-room-error');
    }

    const isError = Array.from(this.inputs).some((item) => item.classList.contains('search-room-error'));
    if (isError) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  static _handleSearchRoomFocus(e) {
    e.currentTarget.classList.remove('search-room-error');
  }
}

function renderSearchRooms(selector) {
  const searchRooms = document.querySelectorAll(selector);
  searchRooms.forEach((searchRoom) => new SearchRoom(searchRoom));
}
renderSearchRooms('.js-search-room');
