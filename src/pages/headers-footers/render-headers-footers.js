import Header from '../../components/header/Header';

const components = [
  { header: Header },
];

(() => {
  const selectorName = '.js-headers-footers';
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
