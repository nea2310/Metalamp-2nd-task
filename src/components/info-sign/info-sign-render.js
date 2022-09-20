import Booking from './InfoSign';

function renderBookings(selector) {
  const infoSigns = document.querySelectorAll(selector);
  infoSigns.forEach((infoSign) => new Booking(selector, infoSign));
}
renderBookings('.js-info-sign');
