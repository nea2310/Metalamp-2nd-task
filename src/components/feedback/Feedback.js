import LikeButton from '../like-button/LikeButton';

class Feedback {
  constructor(element, elementName = 'feedback') {
    this.elementName = elementName;
    this.wrapper = element;
    this._init();
  }

  _init() {
    const likeButtonElement = this.wrapper.querySelector('.js-like-button');
    this.likeButton = new LikeButton(likeButtonElement);
  }
}

export default Feedback;
