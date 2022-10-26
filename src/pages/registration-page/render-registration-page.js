import render from '../../shared/render/render';

const pageSelector = '.js-registration-page';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
