/* eslint-disable no-console */
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
    for (let i = 1; i <= this.images.length; i += 1) {
      const dot = document.createElement('button');
      dot.classList.add(`${this.elementName}__dot`);
      dot.classList.add(`js-${this.elementName}__dot`);
      dot.setAttribute('data-sequence', i);
      dot.setAttribute('aria-label', 'фото номера');
      dot.setAttribute('tabindex', '-1');
      this.dotsWrapper.append(dot);
    }
    this.dots = this._getElements(['dot']);
    this.dots[0].classList.add(`${this.elementName}__dot_active`);
    this.dots.forEach((dot) => {
      // dot - точка, по которой кликнули (должна стать активной)
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
        /* свайп влево */
        this._clickPrevNext(this.buttonPrevious);
      } else {
        /* свайп вправо */
        this._clickPrevNext(this.buttonNext);
      }
      /* сброс значения */
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
    // определяем текущее фото
    const currentPhoto = this._getElement('photo_shown');
    // определяем текущую точку
    const currentDot = this._getElement('dot_active'); // ??
    const i = parseInt(currentPhoto.getAttribute('data-sequence'), 10);
    let newPhoto;
    let newDot;
    // Кликнули [Назад]
    if (element.className.match('previous') || element === 'leftSwipe') {
      if (i !== 1) {
        newPhoto = this._getElemAdv(
          'photo',
          'data-sequence',
          i - 1,
        );
        newDot = this._getElemAdv(
          'dot',
          'data-sequence',
          i - 1,
        );
      } else {
        newPhoto = this._getElemAdv(
          'photo',
          'data-sequence',
          this.images.length,
        );
        newDot = this._getElemAdv(
          'dot',
          'data-sequence', // ??
          this.images.length,
        );
      }
      // Кликнули [Вперед]
    } else if (element.className.match('next') || element === 'rightSwipe') {
      if (i !== this.images.length) {
        newPhoto = this._getElemAdv(
          'photo',
          'data-sequence',
          i + 1,
        );
        newDot = this._getElemAdv(
          'dot',
          'data-sequence',
          i + 1,
        );
      } else {
        newPhoto = this._getElemAdv('photo', 'data-sequence', '1');
        newDot = this._getElemAdv('dot', 'data-sequence', '1');
      }
    }
    this._toggle(currentPhoto, currentDot, newPhoto, newDot);
  }

  _handleRoomCardClickDot(e) {
    const element = e.currentTarget;
    console.log(element);
    const sec = element.getAttribute('data-sequence');
    // определяем текущее фото
    const currentPhoto = this._getElement('photo_shown');
    // определяем активную точку
    const currentDot = this._getElement('dot_active');
    /* определяем новое фото (атрибут data-sequence равен атрибуту data-sequence
     нажатой точки [т.е. новой активной]) */
    const newPhoto = this._getElemAdv('photo', 'data-sequence', sec);
    this._toggle(currentPhoto, currentDot, newPhoto, element);
  }

  // Меняем фото и точку
  _toggle(currentPhoto, currentDot, newPhoto, newDot) {
    // скрываем текущее фото
    currentPhoto.classList.remove(`${this.elementName}__photo_shown`);
    // обесцвечиваем текущую точку
    currentDot.classList.remove(`${this.elementName}__dot_active`);
    // отображаем новое фото
    newPhoto.classList.add(`${this.elementName}__photo_shown`);
    // закрашиваем новую точку
    newDot.classList.add(`${this.elementName}__dot_active`);
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(
      `.${this.elementName}__${selector}`,
    );
  }

  _getElemAdv(className, attrName, attrVal, wrap = this.wrapper) {
    return wrap.querySelector(
      `.${this.elementName}__${className
      }[${attrName}="${attrVal}"]`,
    );
  }

  _getElements(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elementName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }
}

function renderRoomCards(selector) {
  const roomCards = document.querySelectorAll(selector);
  roomCards.forEach((roomCard) => new RoomCard(selector, roomCard));
}
renderRoomCards('.js-room-card');
