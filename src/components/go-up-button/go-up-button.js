import './go-up-button.scss';

class GoUpButton {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._handleGoUpButtonScroll = this._handleGoUpButtonScroll.bind(this);
    this._bindEventListeners();
  }

  _bindEventListeners() {
    // скролл страницы
    window.addEventListener('scroll', this._handleGoUpButtonScroll);
    // клик по кнопке
    this.wrapper.addEventListener('click', GoUpButton._handleGoUpButtonClick);
  }

  _handleGoUpButtonScroll() {
    if (window.pageYOffset >= 300) {
      this.wrapper.classList.remove(`${this.elementName}_hidden`);
    } else {
      this.wrapper.classList.add(`${this.elementName}_hidden`);
    }
  }

  static _handleGoUpButtonClick() {
    window.scrollTo(0, 0);
  }
}

function renderGoUpButtons(selector) {
  const goUpButtons = document.querySelectorAll(selector);
  goUpButtons.forEach((goUpButton) => new GoUpButton(selector, goUpButton));
}
renderGoUpButtons('.js-go-up-button');
