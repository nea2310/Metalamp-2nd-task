import render from '../../shared/render/render';

const pageSelector = '.js-headers-footers';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
