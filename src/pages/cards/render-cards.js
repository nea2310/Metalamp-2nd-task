// import DateDropDown from '../../components/date-dropdown/DateDropdown';
import RoomCard from '../../components/room-card/RoomCard';
import SearchRoom from '../../components/search-room/SearchRoom';
import Booking from '../../components/booking/Booking';
import Registration from '../../components/registration/Registration';
import Login from '../../components/login/Login';

const components = [
  // { 'date-dropdown': DateDropDown },
  { 'room-card': RoomCard },
  { 'search-room': SearchRoom },
  { booking: Booking },
  { registration: Registration },
  { login: Login },
];

(() => {
  const page = document.querySelector('.js-cards');

  if (page) {
    components.forEach((component) => {
      Object.entries(component).forEach(([key, Value]) => {
        const elements = page.querySelectorAll(`.js-${key}`);
        elements.forEach((element) => new Value(`.js-${key}`, element));
      });
    });
  }
})();
