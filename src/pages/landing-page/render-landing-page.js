import SearchRoom from '../../components/search-room/SearchRoom';

const components = [
  { 'search-room': SearchRoom },
];

(() => {
  const selectorName = '.js-landing-page';
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
