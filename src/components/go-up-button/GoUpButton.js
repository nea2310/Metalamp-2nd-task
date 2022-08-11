class GoUpButton {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._handleGoUpButtonScroll = this._handleGoUpButtonScroll.bind(this);
    this._bindEventListeners();
  }

  static _handleGoUpButtonClick() {
    window.scrollTo(0, 0);
  }

  _bindEventListeners() {
    window.addEventListener('scroll', this._handleGoUpButtonScroll);
    this.wrapper.addEventListener('click', GoUpButton._handleGoUpButtonClick);
  }

  _handleGoUpButtonScroll() {
    if (window.pageYOffset >= 300) {
      this.wrapper.classList.remove(`${this.elementName}_hidden`);
    } else {
      this.wrapper.classList.add(`${this.elementName}_hidden`);
    }
  }
}

export default GoUpButton;
