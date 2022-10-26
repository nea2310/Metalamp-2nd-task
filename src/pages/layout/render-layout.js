import render from '../../shared/render/render';

const pageSelector = '.js-layout';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
