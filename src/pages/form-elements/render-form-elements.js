import render from '../../shared/render/render';

const pageSelector = '.js-form-elements';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
