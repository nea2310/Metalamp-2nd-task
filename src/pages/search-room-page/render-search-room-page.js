import FilterForm from '../../components/filter-form/FilterForm';
import RoomCard from '../../components/room-card/RoomCard';
import GoUpButton from '../../components/go-up-button/GoUpButton';

const components = [
  { 'filter-form': FilterForm },
  { 'room-card': RoomCard },
  { 'go-up-button': GoUpButton },
];

(() => {
  const selectorName = '.js-search-room-page';
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
