class RoomCard {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._handleRoomCardClickDot = this._handleRoomCardClickDot.bind(this);
    this._handleRoomCardClickButton = this._handleRoomCardClickButton.bind(this);
    this._render();
    this._createDots();
    this._swipe();
    this._bindEventListeners();
  }

  _render() {
    this.slider = this._getElement('slider');
    this.dotsWrapper = this._getElement('dots');
    this.buttonPrevious = this._getElement('previous');
    this.buttonNext = this._getElement('next');
    this.images = this._getElements(['photo']);
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
    this.dots = this._getElements(['dot']);
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
      if (!xStart) {
        return;
      }
      const xEnd = e.touches[0].clientX;
      const xDelta = xStart - xEnd;
      if (xDelta > 0) {
        this._clickPrevNext(this.buttonPrevious);
      } else {
        this._clickPrevNext(this.buttonNext);
      }
      xStart = null;
    };
    this.slider
      .addEventListener('touchstart', handleTouchStart);
    this.slider
      .addEventListener('touchmove', handleTouchMove);
  }

  _bindEventListeners() {
    this.buttonPrevious.addEventListener('click', this._handleRoomCardClickButton);
    this.buttonNext.addEventListener('click', this._handleRoomCardClickButton);
  }

  _handleRoomCardClickButton(e) {
    this._clickPrevNext(e.target);
  }

  _clickPrevNext(element) {
    const currentPhoto = this._getElement('photo_shown');
    const currentDot = this._getElement('dot_active');
    const i = parseInt(currentPhoto.getAttribute('data-sequence'), 10);
    let newPhoto;
    let newDot;

    if (element.className.match('previous') || element === 'leftSwipe') {
      if (i !== 0) {
        newPhoto = this._getElemAdvanced(
          'photo',
          'data-sequence',
          i - 1,
        );
        newDot = this._getElemAdvanced(
          'dot',
          'data-sequence',
          i - 1,
        );
      } else {
        newPhoto = this._getElemAdvanced(
          'photo',
          'data-sequence',
          this.images.length - 1,
        );
        newDot = this._getElemAdvanced(
          'dot',
          'data-sequence',
          this.images.length - 1,
        );
      }
    } else if (element.className.match('next') || element === 'rightSwipe') {
      if (i !== this.images.length - 1) {
        newPhoto = this._getElemAdvanced(
          'photo',
          'data-sequence',
          i + 1,
        );
        newDot = this._getElemAdvanced(
          'dot',
          'data-sequence',
          i + 1,
        );
      } else {
        newPhoto = this._getElemAdvanced('photo', 'data-sequence', '0');
        newDot = this._getElemAdvanced('dot', 'data-sequence', '0');
      }
    }
    this._toggle(currentPhoto, currentDot, newPhoto, newDot);
  }

  _handleRoomCardClickDot(e) {
    const element = e.currentTarget;
    const sec = element.getAttribute('data-sequence');
    const currentPhoto = this._getElement('photo_shown');
    const currentDot = this._getElement('dot_active');
    const newPhoto = this._getElemAdvanced('photo', 'data-sequence', sec);
    this._toggle(currentPhoto, currentDot, newPhoto, element);
  }

  _toggle(currentPhoto, currentDot, newPhoto, newDot) {
    currentPhoto.classList.remove(`${this.elementName}__photo_shown`);
    currentDot.classList.remove(`${this.elementName}__dot_active`);
    newPhoto.classList.add(`${this.elementName}__photo_shown`);
    newDot.classList.add(`${this.elementName}__dot_active`);
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(
      `.${this.elementName}__${selector}`,
    );
  }

  _getElemAdvanced(className, attrName, attrVal, wrap = this.wrapper) {
    return wrap.querySelector(
      `.${this.elementName}__${className
      }[${attrName}="${attrVal}"]`,
    );
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((selector) => { string += `.js-${this.elementName}__${selector},`; });
    string = string.substring(0, string.length - 1);
    return this.wrapper
      .querySelectorAll(string);
  }
}

export default RoomCard;
