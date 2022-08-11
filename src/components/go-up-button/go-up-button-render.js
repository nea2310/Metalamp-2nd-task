import GoUpButton from './GoUpButton';

function renderGoUpButtons(selector) {
  const goUpButtons = document.querySelectorAll(selector);
  goUpButtons.forEach((goUpButton) => new GoUpButton(selector, goUpButton));
}
renderGoUpButtons('.js-go-up-button');
