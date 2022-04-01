import './header.scss';

class Header {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.render();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elemName}__${selector}`);
  }

  getElems(selectors) {
    let sel = '';
    for (const selector of selectors) {
      sel += `.${this.elemName}__${selector},`;
    }
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }

  render() {
    this.burger = this.getElem('burger-btn');
    this.navLevel1 = this.getElem('nav-level1');
    this.navLevel2 = this.getElems(['nav-level2']);
    this.tips = this.getElems(['nav-level1-item-img']);

    this.navLevel1.addEventListener('mouseover', (e) => {
      this.toggleLevel2Menu(e.relatedTarget, e);
      this.toggleLevel2Menu(e.target, e);
    });
    this.navLevel1.addEventListener('focusin', (e) => {
      this.toggleLevel2Menu(e.target, e);
    });
    // открытьт меню 2-го уровня по нажатию клавиши Пробел
    this.navLevel1.addEventListener('keydown', (e) => {
      if (e.keyCode == 32) {
        e.preventDefault();
        this.toggleLevel2Menu(e.target, e);
      }
    });

    this.navLevel2.forEach((element) => element.addEventListener('mouseout', (e) => {
      if (e.relatedTarget.className.indexOf('nav-level2') === -1) { this.closeLevel2Menu(); }
    }));

    this.tips.forEach((element) => {
      element.addEventListener('click', (e) => {
        this.toggleLevel2Menu(element, e);
      });
    });

    this.burger.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // закрыть меню-бургер при ресайзе страницы
    window.addEventListener('resize', () => {
      if (this.burger.classList
        .contains(`${this.elemName}__burger-btn_active`)) {
        this.toggleMobileMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest(`.${this.elemName}__nav-level2`)) {
        this.closeLevel2Menu();
      }
    });

    document.addEventListener('focusin', (e) => {
      if (!e.target.className.match('item-link')) {
        this.closeLevel2Menu();
      }
    });
  }

  // показать/ скрыть меню второго уровня
  toggleLevel2Menu(elem, event) {
    // для ссылки - открыть меню 2 уровня
    if (elem
      .matches(`.${this.elemName}__nav-level1-item-link`)
      && elem.firstElementChild != null
      && elem.firstElementChild
        .matches(`.${this.elemName}__nav-level1-item-img`)
      && event.type !== 'focusin'
    ) {
      this.closeLevel2Menu();
      elem.parentElement
        .lastElementChild.classList
        .add(`${this.elemName}__nav-level2-item_expanded`);
    }

    // для стрелки - открыть меню 2 уровня
    else if (elem
      .matches(`.${this.elemName}__nav-level1-item-img`)) {
      this.closeLevel2Menu();
      elem.parentElement.parentElement
        .lastElementChild.classList
        .add(`${this.elemName}__nav-level2-item_expanded`);
    }

    // для ссылки - закрыть меню 2 уровня
    else if (elem
      .matches(`.${this.elemName}__nav-level1-item-link`)
      && elem.firstElementChild == null
    ) {
      this.closeLevel2Menu();
    }
  }

  // скрыть меню второго уровня
  closeLevel2Menu() {
    for (const item of this.navLevel2) {
      item.classList.remove(`${this.elemName}__nav-level2-item_expanded`);
    }
  }

  // показать/ скрыть мобильное меню
  toggleMobileMenu() {
    this.burger.classList.toggle(`${this.elemName}__burger-btn_active`);
    this.navLevel1.classList.toggle(`${this.elemName}__nav-level1_active`);
  }
}

function renderHeaders(selector) {
  const headers = document.querySelectorAll(selector);
  for (const header of headers) {
    new Header(selector, header);
  }
}
renderHeaders('.js-header');
