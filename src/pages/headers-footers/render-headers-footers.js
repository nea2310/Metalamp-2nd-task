import Header from '../../components/header/Header';

const components = [
  { header: Header },
];

(() => {
  const page = document.querySelector('.js-headers-footers');

  if (page) {
    components.forEach((component) => {
      Object.entries(component).forEach(([key, Value]) => {
        const elements = page.querySelectorAll(`.js-${key}`);
        elements.forEach((element) => new Value(`.js-${key}`, element));
      });
    });
  }
})();
