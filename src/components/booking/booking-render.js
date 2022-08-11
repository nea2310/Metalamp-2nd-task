import Booking from './booking';

function renderBookings(selector) {
  const bookings = document.querySelectorAll(selector);
  bookings.forEach((booking) => new Booking(selector, booking));
}
renderBookings('.js-booking');
