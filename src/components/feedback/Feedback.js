import LikeButton from '../like-button/LikeButton';

class Feedback {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._init();
  }

  _init() {
    const likeButtonElement = this.wrapper.querySelector('.js-like-button');
    this.likeButton = new LikeButton('.js-like-button', likeButtonElement);
  }
}

export default Feedback;
