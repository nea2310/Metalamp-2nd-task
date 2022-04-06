import './room-card.scss';

class RoomCard {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.clickDot = this.clickDot.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.render();
    this.createDots();
    this.swipe();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(
      `.${this.elemName}__${selector}`,
    );
  }

  getElemAdv(className, attrName, attrVal, wrap = this.wrapper) {
    return wrap.querySelector(
      `.${this.elemName}__${className
      }[${attrName}="${attrVal}"]`,
    );
  }

  getElems(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elemName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }

  handleClick(e) {
    this.clickPrevNext(e.target);
  }

  render() {
    this.slider = this.getElem('slider');
    this.dotsWrapper = this.getElem('dots');
    this.btnPrev = this.getElem('prev');
    this.btnNext = this.getElem('next');
    this.images = this.getElems(['photo']);
    this.btnPrev.addEventListener('click', this.handleClick);
    this.btnNext.addEventListener('click', this.handleClick);
  }

  swipe() {
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
        this.clickPrevNext(this.btnPrev);
      } else {
        /* свайп вправо */
        this.clickPrevNext(this.btnNext);
      }
      /* сброс значения */
      xStart = null;
    };
    this.slider
      .addEventListener('touchstart', handleTouchStart);
    this.slider
      .addEventListener('touchmove', handleTouchMove);
  }

  clickPrevNext(elem) {
    // определяем текущее фото
    const currentPhoto = this.getElem('photo_showed');
    // определяем текущую точку
    const currentDot = this.getElem('dot_active'); // ??
    const i = parseInt(currentPhoto.getAttribute('data-sec'), 10);
    let newPhoto;
    let newDot;
    // Кликнули [Назад]
    if (elem.className.match('prev') || elem === 'leftSwipe') {
      if (i !== 1) {
        newPhoto = this.getElemAdv(
          'photo',
          'data-sec',
          i - 1,
        );
        newDot = this.getElemAdv(
          'dot',
          'data-sec', // ??
          i - 1,
        );
      } else {
        newPhoto = this.getElemAdv(
          'photo',
          'data-sec',
          this.images.length,
        );
        newDot = this.getElemAdv(
          'dot',
          'data-sec', // ??
          this.images.length,
        );
      }
      // Кликнули [Вперед]
    } else if (elem.className.match('next') || elem === 'rightSwipe') {
      if (i !== this.images.length) {
        newPhoto = this.getElemAdv(
          'photo',
          'data-sec',
          i + 1,
        );
        newDot = this.getElemAdv(
          'dot',
          'data-sec', // ??
          i + 1,
        );
      } else {
        newPhoto = this.getElemAdv('photo', 'data-sec', '1');
        newDot = this.getElemAdv('dot', 'data-sec', '1');// ??
      }
    }
    this.toggle(currentPhoto, currentDot, newPhoto, newDot);
  }

  createDots() {
    for (let i = 1; i <= this.images.length; i += 1) {
      const dot = document.createElement('button');
      dot.classList.add(`${this.elemName}__dot`);
      dot.classList.add(`js-${this.elemName}__dot`);
      dot.setAttribute('data-sec', i);
      dot.setAttribute('aria-label', 'фото номера');
      dot.setAttribute('tabindex', '-1');
      this.dotsWrapper.append(dot);
    }
    this.dots = this.getElems(['dot']);
    this.dots[0].classList.add(`${this.elemName}__dot_active`);
    this.dots.forEach((dot) => {
      // dot - точка, по которой кликнули (должна стать активной)
      dot.addEventListener('click', this.clickDot);
    });
  }

  clickDot(e) {
    const elem = e.currentTarget;
    const sec = elem.getAttribute('data-sec');
    // определяем текущее фото
    const currentPhoto = this.getElem('photo_showed');
    // определяем активную точку
    const currentDot = this.getElem('dot_active');
    /* определяем новое фото (атрибут data-sec равен атрибуту data-sec
     нажатой точки [т.е. новой активной]) */
    const newPhoto = this.getElemAdv('photo', 'data-sec', sec);
    this.toggle(currentPhoto, currentDot, newPhoto, elem);
  }

  // Меняем фото и точку
  toggle(currentPhoto, currentDot, newPhoto, newDot) {
    // скрываем текущее фото
    currentPhoto.classList.remove(`${this.elemName}__photo_showed`);
    // обесцвечиваем текущую точку
    currentDot.classList.remove(`${this.elemName}__dot_active`);
    // отображаем новое фото
    newPhoto.classList.add(`${this.elemName}__photo_showed`);
    // закрашиваем новую точку
    newDot.classList.add(`${this.elemName}__dot_active`);
  }
}

function renderRoomCards(selector) {
  const roomCards = document.querySelectorAll(selector);
  roomCards.forEach((roomCard) => new RoomCard(selector, roomCard));
}
renderRoomCards('.js-room-card');
