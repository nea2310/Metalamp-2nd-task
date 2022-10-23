import Header from '../../components/header/Header';
import render from '../../shared/render/render';

const components = [
  { header: Header },
];

const selectorName = '.js-headers-footers';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
