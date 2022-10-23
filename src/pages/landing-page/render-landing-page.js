import SearchRoom from '../../components/search-room/SearchRoom';
import render from '../../shared/render/render';

const components = [
  { 'search-room': SearchRoom },
];

const selectorName = '.js-landing-page';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
