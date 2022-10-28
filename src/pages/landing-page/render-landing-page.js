import render from '../../shared/render/render';

const pageSelector = '.js-landing-page';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
