import './header.scss';

class Header {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleToggleLev2 = this.handleToggleLev2.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleCloseLev2 = this.handleCloseLev2.bind(this);
    this.handleFocusInBurger = this.handleFocusInBurger.bind(this);

    this.render();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elemName}__${selector}`);
  }

  getElems(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elemName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    console.log('sel>>>', sel);
    return this.wrapper
      .querySelectorAll(sel);
  }

  handleMouseover(e) {
    this.toggleLevel2Menu(e.relatedTarget, e);
    this.toggleLevel2Menu(e.target, e);
  }

  handleFocusIn(e) {
    this.toggleLevel2Menu(e.target, e);
  }

  handleKeyDown(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      this.toggleLevel2Menu(e.target, e);
    }
  }

  handleMouseOut(e) {
    if (e.relatedTarget.className.indexOf('nav-level2') === -1) { this.closeLevel2Menu(); }
  }

  handleToggleLev2(e) {
    this.toggleLevel2Menu(e.currentTarget, e);
  }

  handleResize() {
    if (this.burger.classList
      .contains(`${this.elemName}__burger-btn_active`)) {
      this.toggleMobileMenu();
    }
  }

  handleCloseLev2(e) {
    if (!e.target.closest(`.${this.elemName}__nav-level2`)) {
      this.closeLevel2Menu();
    }
  }

  handleFocusInBurger(e) {
    if (!e.target.className.match('item-link')) {
      this.closeLevel2Menu();
    }
  }

  render() {
    this.burger = this.getElem('burger-btn');
    this.navLevel1 = this.getElem('nav-level1');
    this.navLevel2 = this.getElems(['nav-level2']);
    this.tips = this.getElems(['nav-level1-item-img']);

    this.navLevel1.addEventListener('mouseover', this.handleMouseover);
    this.navLevel1.addEventListener('focusin', this.handleFocusIn);

    // открыть меню 2-го уровня по нажатию клавиши Пробел
    this.navLevel1.addEventListener('keydown', this.handleKeyDown);
    this.navLevel2.forEach((element) => element.addEventListener('mouseout', this.handleMouseOut));
    this.tips.forEach((element) => {
      element.addEventListener('click', this.handleToggleLev2);
    });
    this.burger.addEventListener('click', this.toggleMobileMenu);

    // закрыть меню-бургер при ресайзе страницы
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleCloseLev2);
    document.addEventListener('focusin', this.handleFocusInBurger);
  }

  // показать/ скрыть меню второго уровня
  toggleLevel2Menu(elem, event) {
    const condMatch = elem.matches(`.${this.elemName}__nav-level1-item-link`)
      && elem.firstElementChild.matches(`.${this.elemName}__nav-level1-item-img`);
    const condFull = condMatch && elem.firstElementChild != null && event.type !== 'focusin';

    // для ссылки - открыть меню 2 уровня
    if (condFull) {
      this.closeLevel2Menu();
      elem.parentElement.lastElementChild.classList.add(`${this.elemName}__nav-level2-item_expanded`);
    } else if (elem // для стрелки - открыть меню 2 уровня
      .matches(`.${this.elemName}__nav-level1-item-img`)) {
      this.closeLevel2Menu();
      elem.parentElement.parentElement
        .lastElementChild.classList
        .add(`${this.elemName}__nav-level2-item_expanded`);
    } else if (elem // для ссылки - закрыть меню 2 уровня
      .matches(`.${this.elemName}__nav-level1-item-link`)
      && elem.firstElementChild == null
    ) {
      this.closeLevel2Menu();
    }
  }

  // скрыть меню второго уровня
  closeLevel2Menu() {
    this.navLevel2.forEach((item) => item.classList.remove(`${this.elemName}__nav-level2-item_expanded`));
  }

  // показать/ скрыть мобильное меню
  toggleMobileMenu() {
    this.burger.classList.toggle(`${this.elemName}__burger-btn_active`);
    this.navLevel1.classList.toggle(`${this.elemName}__nav-level1_active`);
  }

  // render() {
  //   this.burger = this.getElem('burger-btn');
  //   this.navLevel1 = this.getElem('nav-level1');
  //   this.navLevel2 = this.getElems(['nav-level2']);
  //   this.tips = this.getElems(['nav-level1-item-img']);

  //   this.navLevel1.addEventListener('mouseover', (e) => {
  //     this.toggleLevel2Menu(e.relatedTarget, e);
  //     this.toggleLevel2Menu(e.target, e);
  //   });
  //   this.navLevel1.addEventListener('focusin', (e) => {
  //     this.toggleLevel2Menu(e.target, e);
  //   });
  //   // открытьт меню 2-го уровня по нажатию клавиши Пробел
  //   this.navLevel1.addEventListener('keydown', (e) => {
  //     if (e.keyCode == 32) {
  //       e.preventDefault();
  //       this.toggleLevel2Menu(e.target, e);
  //     }
  //   });

  //   this.navLevel2.forEach((element) => element.addEventListener('mouseout', (e) => {
  //     console.log('mouseout');
  //     console.log(e.relatedTarget.className);

  //     if (e.relatedTarget.className.indexOf('nav-level2') === -1) { this.closeLevel2Menu(); }
  //   }));

  //   this.tips.forEach((element) => {
  //     element.addEventListener('click', (e) => {
  //       this.toggleLevel2Menu(element, e);
  //     });
  //   });

  //   this.burger.addEventListener('click', () => {
  //     this.toggleMobileMenu();
  //   });

  //   // закрыть меню-бургер при ресайзе страницы
  //   window.addEventListener('resize', () => {
  //     if (this.burger.classList
  //       .contains(`${this.elemName}__burger-btn_active`)) {
  //       this.toggleMobileMenu();
  //     }
  //   });

  //   document.addEventListener('click', (e) => {
  //     if (!e.target.closest(`.${this.elemName}__nav-level2`)) {
  //       this.closeLevel2Menu();
  //     }
  //   });

  //   document.addEventListener('focusin', (e) => {
  //     if (!e.target.className.match('item-link')) {
  //       this.closeLevel2Menu();
  //     }
  //   });
  // }

  // // показать/ скрыть меню второго уровня
  // toggleLevel2Menu(elem, event) {
  //   // для ссылки - открыть меню 2 уровня
  //   if (elem
  //     .matches(`.${this.elemName}__nav-level1-item-link`)
  //     && elem.firstElementChild != null
  //     && elem.firstElementChild
  //       .matches(`.${this.elemName}__nav-level1-item-img`)
  //     && event.type !== 'focusin'
  //   ) {
  //     this.closeLevel2Menu();
  //     elem.parentElement
  //       .lastElementChild.classList
  //       .add(`${this.elemName}__nav-level2-item_expanded`);
  //   }

  //   // для стрелки - открыть меню 2 уровня
  //   else if (elem
  //     .matches(`.${this.elemName}__nav-level1-item-img`)) {
  //     this.closeLevel2Menu();
  //     elem.parentElement.parentElement
  //       .lastElementChild.classList
  //       .add(`${this.elemName}__nav-level2-item_expanded`);
  //   }

  //   // для ссылки - закрыть меню 2 уровня
  //   else if (elem
  //     .matches(`.${this.elemName}__nav-level1-item-link`)
  //     && elem.firstElementChild == null
  //   ) {
  //     this.closeLevel2Menu();
  //   }
  // }

  // // скрыть меню второго уровня
  // closeLevel2Menu() {
  //   for (const item of this.navLevel2) {
  //     item.classList.remove(`${this.elemName}__nav-level2-item_expanded`);
  //   }
  // }

  // // показать/ скрыть мобильное меню
  // toggleMobileMenu() {
  //   this.burger.classList.toggle(`${this.elemName}__burger-btn_active`);
  //   this.navLevel1.classList.toggle(`${this.elemName}__nav-level1_active`);
  // }
}

function renderHeaders(selector) {
  const headers = document.querySelectorAll(selector);
  headers.forEach((header) => new Header(selector, header));
}
renderHeaders('.js-header');
