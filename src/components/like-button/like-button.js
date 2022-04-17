import './like-button.scss';

const iconLike = require(
  './img/favorite.svg',
);
const iconUnlike = require(
  './img/favorite-border.svg',
);

class LikeButton {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this._handleLikeButtonClick = this._handleLikeButtonClick.bind(this);
    this._handleLikeButtonLoadWindow = this._handleLikeButtonLoadWindow.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.button = this._getElem('button');
    this.img = this._getElem('img');
    this.counter = this._getElem('counter');
  }

  _bindEventListeners() {
    // клик по кнопке
    this.button.addEventListener('click', this._handleLikeButtonClick);

    window.addEventListener('load', this._handleLikeButtonLoadWindow);
  }

  _handleLikeButtonClick() {
    const val = parseInt(this.counter.innerText, 10);
    this.button.classList.toggle(`${this.elemName}_liked`);
    if (this.button.classList.contains(`${this.elemName}_liked`)) {
      this.img.src = iconLike;
      this.counter.innerText = val + 1;
      localStorage.setItem('isLiked', 'liked');
    } else {
      this.img.src = iconUnlike;
      this.counter.innerText = val - 1;
      localStorage.setItem('isLiked', 'unliked');
    }
  }

  _handleLikeButtonLoadWindow() {
    if (localStorage.getItem('isLiked') === 'liked') {
      this.button.classList.add(`${this.elemName}_liked`);
      this.img.src = iconLike;
    } else {
      this.button.classList.remove(`${this.elemName}_liked`);
      this.img.src = iconUnlike;
    }
  }

  _getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elemName}__${selector}`);
  }
}

function renderLikeButtons(selector) {
  const likeButtons = document.querySelectorAll(selector);
  likeButtons.forEach((likeButton) => new LikeButton(selector, likeButton));
}
renderLikeButtons('.js-like-button');
