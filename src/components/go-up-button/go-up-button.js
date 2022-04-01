import './go-up-button.scss';

class GoUpButton {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.click();
    this.checkScroll();
  }

  checkScroll() {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset >= 300) {
        this.wrapper.classList.remove(`${this.elemName}_hidden`);
      } else {
        this.wrapper.classList.add(`${this.elemName}_hidden`);
      }
    });
  }

  // клик по кнопке
  click() {
    this.wrapper.addEventListener('click', () => {
      window.scrollTo(0, 0);
    });
  }
}

function renderGoUpButtons(selector) {
  const goUpButtons = document.querySelectorAll(selector);
  for (const goUpButton of goUpButtons) {
    new GoUpButton(selector, goUpButton);
  }
}
renderGoUpButtons('.js-go-up-button');
