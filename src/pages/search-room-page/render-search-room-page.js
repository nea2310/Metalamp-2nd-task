import render from '../../shared/render/render';

const pageSelector = '.js-search-room-page';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
