import getElement from '../../shared/utils/getElement';
import getElements from '../../shared/utils/getElements';

class RoomCard {
  constructor(element, elementName = 'room-card') {
    this.elementName = elementName;
    this.wrapper = element;

    this._bindEventListeners();
    this._render();
  }

  _render() {
    this.slider = getElement('slider', this.wrapper, this.elementName);
    this.dotsWrapper = getElement('dots', this.wrapper, this.elementName);
    this.buttonPrevious = getElement('previous', this.wrapper, this.elementName);
    this.buttonNext = getElement('next', this.wrapper, this.elementName);
    this.images = getElements(['photo'], this.wrapper, this.elementName);

    this._createDots();
    this._swipe();
    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleRoomCardClickDot = this._handleRoomCardClickDot.bind(this);
    this._handleRoomCardClickButton = this._handleRoomCardClickButton.bind(this);
  }

  _addEventListeners() {
    this.buttonPrevious.addEventListener('click', this._handleRoomCardClickButton);
    this.buttonNext.addEventListener('click', this._handleRoomCardClickButton);
  }

  _createDots() {
    this.images.forEach((item, i) => {
      const dot = document.createElement('button');
      dot.classList.add(`${this.elementName}__dot`);
      dot.classList.add(`js-${this.elementName}__dot`);
      dot.setAttribute('data-sequence', i);
      dot.setAttribute('aria-label', 'фото номера');
      dot.setAttribute('tabindex', '-1');
      this.dotsWrapper.append(dot);
    });
    this.dots = getElements(['dot'], this.wrapper, this.elementName);
    this.dots[0].classList.add(`${this.elementName}__dot_active`);
    this.dots.forEach((dot) => {
      dot.addEventListener('click', this._handleRoomCardClickDot);
    });
  }

  _swipe() {
    let xStart = null;
    const handleTouchStart = (e) => {
      xStart = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      if (!xStart) return;

      const xEnd = e.touches[0].clientX;
      const xDelta = xStart - xEnd;
      if (xDelta > 0) {
        this._clickPrevNext(this.buttonPrevious);
      } else {
        this._clickPrevNext(this.buttonNext);
      }

      xStart = null;
    };
    this.slider.addEventListener('touchstart', handleTouchStart);
    this.slider.addEventListener('touchmove', handleTouchMove);
  }

  _handleRoomCardClickButton(e) {
    this._clickPrevNext(e.target);
  }

  _clickPrevNext(element) {
    const currentPhoto = getElement('photo_shown', this.wrapper, this.elementName);
    const currentDot = getElement('dot_active', this.wrapper, this.elementName);
    const i = parseInt(currentPhoto.getAttribute('data-sequence'), 10);
    let newPhoto;
    let newDot;

    if (element.className.match('previous') || element === 'leftSwipe') {
      if (i !== 0) {
        newPhoto = this._getElements(
          'photo',
          'data-sequence',
          i - 1,
        );
        newDot = this._getElements(
          'dot',
          'data-sequence',
          i - 1,
        );
      } else {
        newPhoto = this._getElements(
          'photo',
          'data-sequence',
          this.images.length - 1,
        );
        newDot = this._getElements(
          'dot',
          'data-sequence',
          this.images.length - 1,
        );
      }
    } else if (element.className.match('next') || element === 'rightSwipe') {
      if (i !== this.images.length - 1) {
        newPhoto = this._getElements(
          'photo',
          'data-sequence',
          i + 1,
        );
        newDot = this._getElements(
          'dot',
          'data-sequence',
          i + 1,
        );
      } else {
        newPhoto = this._getElements('photo', 'data-sequence', '0');
        newDot = this._getElements('dot', 'data-sequence', '0');
      }
    }
    this._toggle(currentPhoto, currentDot, newPhoto, newDot);
  }

  _handleRoomCardClickDot(e) {
    const element = e.currentTarget;
    const sec = element.getAttribute('data-sequence');
    const currentPhoto = getElement('photo_shown', this.wrapper, this.elementName);
    const currentDot = getElement('dot_active', this.wrapper, this.elementName);
    const newPhoto = this._getElements('photo', 'data-sequence', sec);
    this._toggle(currentPhoto, currentDot, newPhoto, element);
  }

  _toggle(currentPhoto, currentDot, newPhoto, newDot) {
    currentPhoto.classList.remove(`${this.elementName}__photo_shown`);
    currentDot.classList.remove(`${this.elementName}__dot_active`);
    newPhoto.classList.add(`${this.elementName}__photo_shown`);
    newDot.classList.add(`${this.elementName}__dot_active`);
  }

  _getElements(className, attrName, attrVal, wrap = this.wrapper) {
    return wrap.querySelector(`.${this.elementName}__${className}[${attrName}='${attrVal}']`);
  }
}

export default RoomCard;
