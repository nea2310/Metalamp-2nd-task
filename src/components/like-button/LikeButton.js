import getElement from '../../shared/utils/getElement';

class LikeButton {
  constructor(element, elementName = 'like-button') {
    this.elementName = elementName;
    this.wrapper = element;

    this._bindEventListeners();
    this._render();
  }

  _render() {
    this.button = getElement('button', this.wrapper, this.elementName);
    this.image = getElement('image', this.wrapper, this.elementName);
    this.counter = getElement('counter', this.wrapper, this.elementName);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleLikeButtonClick = this._handleLikeButtonClick.bind(this);
  }

  _addEventListeners() {
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
}

export default LikeButton;
