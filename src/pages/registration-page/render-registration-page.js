import Registration from '../../components/registration/Registration';
import render from '../../shared/render/render';

const components = [
  { registration: Registration },
];

const selectorName = '.js-registration-page';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
