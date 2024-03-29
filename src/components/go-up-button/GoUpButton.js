class GoUpButton {
  constructor(element, elementName = 'go-up-button') {
    this.elementName = elementName;
    this.wrapper = element;

    this._bindEventListeners();
    this._addEventListeners();
  }

  static _handleGoUpButtonClick() {
    window.scrollTo(0, 0);
  }

  _bindEventListeners() {
    this._handleGoUpButtonScroll = this._handleGoUpButtonScroll.bind(this);
  }

  _addEventListeners() {
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
