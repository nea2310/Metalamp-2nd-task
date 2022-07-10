class Header {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this._handleHeaderMouseoverLevel1 = this._handleHeaderMouseoverLevel1.bind(this);
    this._handleHeaderFocusinLevel1 = this._handleHeaderFocusinLevel1.bind(this);
    this._handleHeaderKeydownLevel1 = this._handleHeaderKeydownLevel1.bind(this);
    this._handleHeaderMouseoutLevel2 = this._handleHeaderMouseoutLevel2.bind(this);
    this._handleHeaderClickLevel2 = this._handleHeaderClickLevel2.bind(this);
    this._handleHeaderClickBurger = this._handleHeaderClickBurger.bind(this);
    this._handleHeaderResizeWindow = this._handleHeaderResizeWindow.bind(this);
    this._handleHeaderClickDoc = this._handleHeaderClickDoc.bind(this);
    this._handleHeaderFocusinDoc = this._handleHeaderFocusinDoc.bind(this);

    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.burger = this._getElement('burger-button');
    this.navLevel1 = this._getElement('nav-level1');
    this.navLevel2 = this._getElements(['nav-level2']);
    this.tips = this._getElements(['nav-level1-item-image']);
  }

  _bindEventListeners() {
    this.navLevel1.addEventListener('mouseover', this._handleHeaderMouseoverLevel1);
    this.navLevel1.addEventListener('focusin', this._handleHeaderFocusinLevel1);
    this.navLevel1.addEventListener('keydown', this._handleHeaderKeydownLevel1);
    this.navLevel2.forEach((element) => element.addEventListener('mouseout', this._handleHeaderMouseoutLevel2));
    this.tips.forEach((element) => {
      element.addEventListener('click', this._handleHeaderClickLevel2);
    });
    this.burger.addEventListener('click', this._handleHeaderClickBurger);
    document.addEventListener('click', this._handleHeaderClickDoc);
    document.addEventListener('focusin', this._handleHeaderFocusinDoc);
    window.addEventListener('resize', this._handleHeaderResizeWindow);
  }

  _handleHeaderMouseoverLevel1(e) {
    this._toggleLevel2Menu(e.relatedTarget, e);
    this._toggleLevel2Menu(e.target, e);
  }

  _handleHeaderFocusinLevel1(e) {
    this._toggleLevel2Menu(e.target, e);
  }

  _handleHeaderKeydownLevel1(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      this._toggleLevel2Menu(e.target, e);
    }
  }

  _handleHeaderMouseoutLevel2(e) {
    if (e.relatedTarget.className.indexOf('nav-level2') === -1) { this._closeLevel2Menu(); }
  }

  _handleHeaderClickLevel2(e) {
    this._toggleLevel2Menu(e.currentTarget, e);
  }

  _handleHeaderResizeWindow() {
    if (this.burger.classList
      .contains(`${this.elementName}__burger-button_active`)) {
      this._handleHeaderClickBurger();
    }
  }

  _handleHeaderClickDoc(e) {
    if (!e.target.closest(`.${this.elementName}__nav-level2`)) {
      this._closeLevel2Menu();
    }
  }

  _handleHeaderFocusinDoc(e) {
    if (!e.target.className.match('item-link')) {
      this._closeLevel2Menu();
    }
  }

  _handleHeaderClickBurger() {
    this.burger.classList.toggle(`${this.elementName}__burger-button_active`);
    this.navLevel1.classList.toggle(`${this.elementName}__nav-level1_active`);
  }

  _toggleLevel2Menu(element, event) {
    if (!element.firstElementChild) return;
    const condMatch = element.matches(`.${this.elementName}__nav-level1-item-link`)
      && element.firstElementChild.matches(`.${this.elementName}__nav-level1-item-image`);
    const condFull = condMatch && element.firstElementChild != null && event.type !== 'focusin';

    if (condFull) {
      this._closeLevel2Menu();
      element.parentElement.lastElementChild.classList.add(`${this.elementName}__nav-level2-item_expanded`);
    } else if (element
      .matches(`.${this.elementName}__nav-level1-item-image`)) {
      this._closeLevel2Menu();
      element.parentElement.parentElement
        .lastElementChild.classList
        .add(`${this.elementName}__nav-level2-item_expanded`);
    } else if (element
      .matches(`.${this.elementName}__nav-level1-item-link`)
      && element.firstElementChild == null
    ) {
      this._closeLevel2Menu();
    }
  }

  _closeLevel2Menu() {
    this.navLevel2.forEach((item) => item.classList.remove(`${this.elementName}__nav-level2-item_expanded`));
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((selector) => { string += `.js-${this.elementName}__${selector},`; });
    string = string.substring(0, string.length - 1);
    return this.wrapper
      .querySelectorAll(string);
  }
}

function renderHeaders(selector) {
  const headers = document.querySelectorAll(selector);
  headers.forEach((header) => new Header(selector, header));
}
renderHeaders('.js-header');
