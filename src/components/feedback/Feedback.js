import LikeButton from '../like-button/LikeButton';

class Feedback {
  constructor(element, elementName = 'feedback') {
    this.elementName = elementName;
    this.wrapper = element;

    this._render();
  }

  _render() {
    const likeButtonElement = this.wrapper.querySelector('.js-like-button');
    this.likeButton = new LikeButton(likeButtonElement);
  }
}

export default Feedback;
