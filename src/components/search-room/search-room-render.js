import SearchRoom from './SearchRoom';

function renderSearchRooms(selector) {
  const searchRooms = document.querySelectorAll(selector);
  searchRooms.forEach((searchRoom) => new SearchRoom(selector, searchRoom));
}
renderSearchRooms('.js-search-room');
