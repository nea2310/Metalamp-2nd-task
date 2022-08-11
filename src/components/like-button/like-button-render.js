import LikeButton from './like-button';

function renderLikeButtons(selector) {
  const likeButtons = document.querySelectorAll(selector);
  likeButtons.forEach((likeButton) => new LikeButton(selector, likeButton));
}
renderLikeButtons('.js-like-button');
