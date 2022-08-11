class LikeButton {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._handleLikeButtonClick = this._handleLikeButtonClick.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.button = this._getElement('button');
    this.image = this._getElement('image');
    this.counter = this._getElement('counter');
  }

  _bindEventListeners() {
    this.button.addEventListener('click', this._handleLikeButtonClick);
  }

  _handleLikeButtonClick() {
    const value = parseInt(this.counter.innerText, 10);
    this.button.classList.toggle(`${this.elementName}__button_liked`);
    if (this.button.classList.contains(`${this.elementName}__button_liked`)) {
      this.counter.innerText = value + 1;
    } else {
      this.counter.innerText = value - 1;
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(`.${this.elementName}__${selector}`);
  }
}

export default LikeButton;
