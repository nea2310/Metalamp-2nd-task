import Login from '../../components/login/Login';
import render from '../../shared/render/render';

const components = [
  { login: Login },
];

const selectorName = '.js-sign-in-page';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
