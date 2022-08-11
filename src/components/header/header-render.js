import Header from './header';

function renderHeaders(selector) {
  const headers = document.querySelectorAll(selector);
  headers.forEach((header) => new Header(selector, header));
}
renderHeaders('.js-header');
