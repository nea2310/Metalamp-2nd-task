import DateDropDown from '../../components/date-dropdown/DateDropdown';
import RoomCard from '../../components/room-card/RoomCard';
import SearchRoom from '../../components/search-room/SearchRoom';
import Booking from '../../components/booking/Booking';
import Registration from '../../components/registration/Registration';
import Login from '../../components/login/Login';

const components = [
  { 'date-dropdown': DateDropDown },
  { 'room-card': RoomCard },
  { 'search-room': SearchRoom },
  { booking: Booking },
  { registration: Registration },
  { login: Login },
];

(() => {
  const selectorName = '.js-cards';
  const page = document.querySelector(selectorName);

  if (page) {
    components.forEach((component) => {
      Object.entries(component).forEach(([key, Value]) => {
        const elements = page.querySelectorAll(`${selectorName}__${key}`);
        elements.forEach((item) => {
          const element = item.querySelector(`.js-${key}`);
          return new Value(`.js-${key}`, element);
        });
      });
    });
  }
})();
