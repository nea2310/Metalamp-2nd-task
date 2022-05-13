const iconLike = require(
  './image/favorite.svg',
);
const iconUnlike = require(
  './image/favorite-border.svg',
);

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

    window.addEventListener('load', this._handleLikeButtonLoadWindow);
  }

  _handleLikeButtonClick() {
    const value = parseInt(this.counter.innerText, 10);
    this.button.classList.toggle(`${this.elementName}__button_liked`);
    if (this.button.classList.contains(`${this.elementName}__button_liked`)) {
      this.image.src = iconLike;
      this.counter.innerText = value + 1;
    } else {
      this.image.src = iconUnlike;
      this.counter.innerText = value - 1;
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elementName}__${selector}`);
  }
}

function renderLikeButtons(selector) {
  const likeButtons = document.querySelectorAll(selector);
  likeButtons.forEach((likeButton) => new LikeButton(selector, likeButton));
}
renderLikeButtons('.js-like-button');
