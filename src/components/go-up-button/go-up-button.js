import './go-up-button.scss';

class GoUpButton {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.handleScroll = this.handleScroll.bind(this);
    this.click();
    this.checkScroll();
  }

  static handleClick() {
    window.scrollTo(0, 0);
  }

  handleScroll() {
    if (window.pageYOffset >= 300) {
      this.wrapper.classList.remove(`${this.elemName}_hidden`);
    } else {
      this.wrapper.classList.add(`${this.elemName}_hidden`);
    }
  }

  checkScroll() {
    window.addEventListener('scroll', this.handleScroll);
  }

  // клик по кнопке
  click() {
    this.wrapper.addEventListener('click', GoUpButton.handleClick);
  }
}

function renderGoUpButtons(selector) {
  const goUpButtons = document.querySelectorAll(selector);
  goUpButtons.forEach((goUpButton) => new GoUpButton(selector, goUpButton));
}
renderGoUpButtons('.js-go-up-button');
