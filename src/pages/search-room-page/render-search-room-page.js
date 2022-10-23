import FilterForm from '../../components/filter-form/FilterForm';
import RoomCard from '../../components/room-card/RoomCard';
import GoUpButton from '../../components/go-up-button/GoUpButton';
import render from '../../shared/render/render';

const components = [
  { 'filter-form': FilterForm },
  { 'room-card': RoomCard },
  { 'go-up-button': GoUpButton },
];

const selectorName = '.js-search-room-page';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
