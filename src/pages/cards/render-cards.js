import DateDropDown from '../../components/date-dropdown/DateDropdown';
import RoomCard from '../../components/room-card/RoomCard';
import SearchRoom from '../../components/search-room/SearchRoom';
import Booking from '../../components/booking/Booking';
import Registration from '../../components/registration/Registration';
import Login from '../../components/login/Login';
import render from '../../shared/render/render';

const components = [
  { 'date-dropdown': DateDropDown },
  { 'room-card': RoomCard },
  { 'search-room': SearchRoom },
  { booking: Booking },
  { registration: Registration },
  { login: Login },
];
const selectorName = '.js-cards';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
