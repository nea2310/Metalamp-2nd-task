import render from '../../shared/render/render';

const pageSelector = '.js-cards';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
