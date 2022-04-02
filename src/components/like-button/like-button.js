import './like-button.scss';
class LikeButton {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.render();
    this.click();
    this.updLikeStatus();

  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper.
      querySelector('.' + this.elemName + '__' + selector);
  }

  render() {
    this.button = this.getElem('button');
    this.img = this.getElem('img');
    this.counter = this.getElem('counter');

    this.iconLike = require(
      './img/favorite.svg'
    );

    this.iconUnlike = require(
      './img/favorite-border.svg'
    );
  }


  // клик по кнопке
  click() {
    this.button.addEventListener("click", () => {
      let val = parseInt(this.counter.innerText);
      this.button.classList.toggle(this.elemName + '_liked');
      if (this.button.classList.contains(this.elemName + '_liked')) {
        this.img.src = this.iconLike;
        this.counter.innerText = val + 1;
        localStorage.setItem('isLiked', 'liked');
      } else {
        this.img.src = this.iconUnlike;
        this.counter.innerText = val - 1;
        localStorage.setItem('isLiked', 'unliked');
      }
    });
  }

  updLikeStatus() {
    window.addEventListener('load', () => {
      if (localStorage.getItem('isLiked') == 'liked') {
        this.button.classList.add(this.elemName + '_liked');
        this.img.src = this.iconLike;
      } else {
        this.button.classList.remove(this.elemName + '_liked');
        this.img.src = this.iconUnlike;
      }
    });
  }




}

function renderLikeButtons(selector) {
  let likeButtons = document.querySelectorAll(selector);
  for (let likeButton of likeButtons) {
    new LikeButton(selector, likeButton);
  }
}
renderLikeButtons('.js-like-button');

