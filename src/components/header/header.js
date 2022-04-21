import './header.scss';

class Header {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;

    this._handleHeaderMouseoverLev1 = this._handleHeaderMouseoverLev1.bind(this);
    this._handleHeaderFocusinLev1 = this._handleHeaderFocusinLev1.bind(this);
    this._handleHeaderKeydownLev1 = this._handleHeaderKeydownLev1.bind(this);
    this._handleHeaderMouseoutLev2 = this._handleHeaderMouseoutLev2.bind(this);
    this._handleHeaderClickLev2 = this._handleHeaderClickLev2.bind(this);
    this._handleHeaderClickBurger = this._handleHeaderClickBurger.bind(this);
    this._handleHeaderResizeWindow = this._handleHeaderResizeWindow.bind(this);
    this._handleHeaderClickDoc = this._handleHeaderClickDoc.bind(this);
    this._handleHeaderFocusinDoc = this._handleHeaderFocusinDoc.bind(this);

    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.burger = this._getElem('burger-btn');
    this.navLevel1 = this._getElem('nav-level1');
    this.navLevel2 = this._getElems(['nav-level2']);
    this.tips = this._getElems(['nav-level1-item-image']);
  }

  _bindEventListeners() {
    this.navLevel1.addEventListener('mouseover', this._handleHeaderMouseoverLev1);
    this.navLevel1.addEventListener('focusin', this._handleHeaderFocusinLev1);

    // открыть меню 2-го уровня по нажатию клавиши Пробел
    this.navLevel1.addEventListener('keydown', this._handleHeaderKeydownLev1);
    this.navLevel2.forEach((element) => element.addEventListener('mouseout', this._handleHeaderMouseoutLev2));
    this.tips.forEach((element) => {
      element.addEventListener('click', this._handleHeaderClickLev2);
    });
    this.burger.addEventListener('click', this._handleHeaderClickBurger);

    // закрыть меню-бургер при ресайзе страницы
    document.addEventListener('click', this._handleHeaderClickDoc);
    document.addEventListener('focusin', this._handleHeaderFocusinDoc);
    window.addEventListener('resize', this._handleHeaderResizeWindow);
  }

  _handleHeaderMouseoverLev1(e) {
    this._toggleLevel2Menu(e.relatedTarget, e);
    this._toggleLevel2Menu(e.target, e);
  }

  _handleHeaderFocusinLev1(e) {
    this._toggleLevel2Menu(e.target, e);
  }

  _handleHeaderKeydownLev1(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      this._toggleLevel2Menu(e.target, e);
    }
  }

  _handleHeaderMouseoutLev2(e) {
    if (e.relatedTarget.className.indexOf('nav-level2') === -1) { this._closeLevel2Menu(); }
  }

  _handleHeaderClickLev2(e) {
    this._toggleLevel2Menu(e.currentTarget, e);
  }

  _handleHeaderResizeWindow() {
    if (this.burger.classList
      .contains(`${this.elemName}__burger-btn_active`)) {
      this._handleHeaderClickBurger();
    }
  }

  _handleHeaderClickDoc(e) {
    if (!e.target.closest(`.${this.elemName}__nav-level2`)) {
      this._closeLevel2Menu();
    }
  }

  _handleHeaderFocusinDoc(e) {
    if (!e.target.className.match('item-link')) {
      this._closeLevel2Menu();
    }
  }

  // показать/ скрыть мобильное меню
  _handleHeaderClickBurger() {
    this.burger.classList.toggle(`${this.elemName}__burger-btn_active`);
    this.navLevel1.classList.toggle(`${this.elemName}__nav-level1_active`);
  }

  // показать/ скрыть меню второго уровня
  _toggleLevel2Menu(elem, event) {
    const condMatch = elem.matches(`.${this.elemName}__nav-level1-item-link`)
      && elem.firstElementChild.matches(`.${this.elemName}__nav-level1-item-image`);
    const condFull = condMatch && elem.firstElementChild != null && event.type !== 'focusin';

    // для ссылки - открыть меню 2 уровня
    if (condFull) {
      this._closeLevel2Menu();
      elem.parentElement.lastElementChild.classList.add(`${this.elemName}__nav-level2-item_expanded`);
    } else if (elem // для стрелки - открыть меню 2 уровня
      .matches(`.${this.elemName}__nav-level1-item-image`)) {
      this._closeLevel2Menu();
      elem.parentElement.parentElement
        .lastElementChild.classList
        .add(`${this.elemName}__nav-level2-item_expanded`);
    } else if (elem // для ссылки - закрыть меню 2 уровня
      .matches(`.${this.elemName}__nav-level1-item-link`)
      && elem.firstElementChild == null
    ) {
      this._closeLevel2Menu();
    }
  }

  // скрыть меню второго уровня
  _closeLevel2Menu() {
    this.navLevel2.forEach((item) => item.classList.remove(`${this.elemName}__nav-level2-item_expanded`));
  }

  _getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elemName}__${selector}`);
  }

  _getElems(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elemName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }
}

function renderHeaders(selector) {
  const headers = document.querySelectorAll(selector);
  headers.forEach((header) => new Header(selector, header));
}
renderHeaders('.js-header');
