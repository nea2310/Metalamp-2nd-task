import RoomCard from './RoomCard';

function renderRoomCards(selector) {
  const roomCards = document.querySelectorAll(selector);
  roomCards.forEach((roomCard) => new RoomCard(selector, roomCard));
}
renderRoomCards('.js-room-card');
