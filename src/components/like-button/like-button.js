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
    this.handleClick = this.handleClick.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.render();
    this.click();
    this.updLikeStatus();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elemName}__${selector}`);
  }

  render() {
    this.button = this.getElem('button');
    this.img = this.getElem('img');
    this.counter = this.getElem('counter');
  }

  handleClick() {
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

  handleLoad() {
    if (localStorage.getItem('isLiked') === 'liked') {
      this.button.classList.add(`${this.elemName}_liked`);
      this.img.src = iconLike;
    } else {
      this.button.classList.remove(`${this.elemName}_liked`);
      this.img.src = iconUnlike;
    }
  }

  // клик по кнопке
  click() {
    this.button.addEventListener('click', this.handleClick);
  }

  updLikeStatus() {
    window.addEventListener('load', this.handleLoad);
  }
}

function renderLikeButtons(selector) {
  const likeButtons = document.querySelectorAll(selector);
  likeButtons.forEach((likeButton) => new LikeButton(selector, likeButton));
}
renderLikeButtons('.js-like-button');
