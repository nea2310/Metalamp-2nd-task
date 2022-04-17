import './room-card.scss';

class RoomCard {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this._handleRoomCardClickDot = this._handleRoomCardClickDot.bind(this);
    this._handleRoomCardClickBtn = this._handleRoomCardClickBtn.bind(this);
    this._render();
    this._createDots();
    this._swipe();
    this._bindEventListeners();
  }

  _render() {
    this.slider = this._getElem('slider');
    this.dotsWrapper = this._getElem('dots');
    this.btnPrev = this._getElem('prev');
    this.btnNext = this._getElem('next');
    this.images = this._getElems(['photo']);
  }

  _createDots() {
    for (let i = 1; i <= this.images.length; i += 1) {
      const dot = document.createElement('button');
      dot.classList.add(`${this.elemName}__dot`);
      dot.classList.add(`js-${this.elemName}__dot`);
      dot.setAttribute('data-sec', i);
      dot.setAttribute('aria-label', 'фото номера');
      dot.setAttribute('tabindex', '-1');
      this.dotsWrapper.append(dot);
    }
    this.dots = this._getElems(['dot']);
    this.dots[0].classList.add(`${this.elemName}__dot_active`);
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
      const xDiff = xStart - xEnd;
      if (xDiff > 0) {
        /* свайп влево */
        this._clickPrevNext(this.btnPrev);
      } else {
        /* свайп вправо */
        this._clickPrevNext(this.btnNext);
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
    this.btnPrev.addEventListener('click', this._handleRoomCardClickBtn);
    this.btnNext.addEventListener('click', this._handleRoomCardClickBtn);
  }

  _handleRoomCardClickBtn(e) {
    this._clickPrevNext(e.target);
  }

  _clickPrevNext(elem) {
    // определяем текущее фото
    const currentPhoto = this._getElem('photo_showed');
    // определяем текущую точку
    const currentDot = this._getElem('dot_active'); // ??
    const i = parseInt(currentPhoto.getAttribute('data-sec'), 10);
    let newPhoto;
    let newDot;
    // Кликнули [Назад]
    if (elem.className.match('prev') || elem === 'leftSwipe') {
      if (i !== 1) {
        newPhoto = this._getElemAdv(
          'photo',
          'data-sec',
          i - 1,
        );
        newDot = this._getElemAdv(
          'dot',
          'data-sec', // ??
          i - 1,
        );
      } else {
        newPhoto = this._getElemAdv(
          'photo',
          'data-sec',
          this.images.length,
        );
        newDot = this._getElemAdv(
          'dot',
          'data-sec', // ??
          this.images.length,
        );
      }
      // Кликнули [Вперед]
    } else if (elem.className.match('next') || elem === 'rightSwipe') {
      if (i !== this.images.length) {
        newPhoto = this._getElemAdv(
          'photo',
          'data-sec',
          i + 1,
        );
        newDot = this._getElemAdv(
          'dot',
          'data-sec', // ??
          i + 1,
        );
      } else {
        newPhoto = this._getElemAdv('photo', 'data-sec', '1');
        newDot = this._getElemAdv('dot', 'data-sec', '1');// ??
      }
    }
    this._toggle(currentPhoto, currentDot, newPhoto, newDot);
  }

  _handleRoomCardClickDot(e) {
    const elem = e.currentTarget;
    const sec = elem.getAttribute('data-sec');
    // определяем текущее фото
    const currentPhoto = this._getElem('photo_showed');
    // определяем активную точку
    const currentDot = this._getElem('dot_active');
    /* определяем новое фото (атрибут data-sec равен атрибуту data-sec
     нажатой точки [т.е. новой активной]) */
    const newPhoto = this._getElemAdv('photo', 'data-sec', sec);
    this._toggle(currentPhoto, currentDot, newPhoto, elem);
  }

  // Меняем фото и точку
  _toggle(currentPhoto, currentDot, newPhoto, newDot) {
    // скрываем текущее фото
    currentPhoto.classList.remove(`${this.elemName}__photo_showed`);
    // обесцвечиваем текущую точку
    currentDot.classList.remove(`${this.elemName}__dot_active`);
    // отображаем новое фото
    newPhoto.classList.add(`${this.elemName}__photo_showed`);
    // закрашиваем новую точку
    newDot.classList.add(`${this.elemName}__dot_active`);
  }

  _getElem(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(
      `.${this.elemName}__${selector}`,
    );
  }

  _getElemAdv(className, attrName, attrVal, wrap = this.wrapper) {
    return wrap.querySelector(
      `.${this.elemName}__${className
      }[${attrName}="${attrVal}"]`,
    );
  }

  _getElems(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elemName}__${selector},`; });
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
