class Header {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this._handleHeaderKeydownTip = this._handleHeaderKeydownTip.bind(this);
    this._handleHeaderClickTip = this._handleHeaderClickTip.bind(this);
    this._handleHeaderClickBurger = this._handleHeaderClickBurger.bind(this);
    this._handleHeaderResizeWindow = this._handleHeaderResizeWindow.bind(this);
    this._handleHeaderClickDoc = this._handleHeaderClickDoc.bind(this);
    this._handleHeaderFocusinDoc = this._handleHeaderFocusinDoc.bind(this);
    this._handleHeaderFocusLinkLevel1 = this._handleHeaderFocusLinkLevel1.bind(this);
    this._handleHeaderKeydownNavLevel2 = this._handleHeaderKeydownNavLevel2.bind(this);

    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.burger = this._getElement('burger-button');
    this.content = this._getElement('content');
    this.navLevel1 = this._getElement('nav-level1');
    this.navLevel2 = this._getElements(['nav-level2']);
    this.tips = this._getElements(['nav-level1-item-tip']);
    this.linksLevel1 = this._getElements(['nav-level1-item-link']);
  }

  _bindEventListeners() {
    this.linksLevel1.forEach((element) => {
      element.addEventListener('focus', this._handleHeaderFocusLinkLevel1);
    });

    this.navLevel2.forEach((element) => {
      element.addEventListener('keydown', this._handleHeaderKeydownNavLevel2);
    });

    this.tips.forEach((element) => {
      element.addEventListener('click', this._handleHeaderClickTip);
      element.addEventListener('keydown', this._handleHeaderKeydownTip);
    });
    this.burger.addEventListener('click', this._handleHeaderClickBurger);
    document.addEventListener('click', this._handleHeaderClickDoc);
    document.addEventListener('focusin', this._handleHeaderFocusinDoc);
    window.addEventListener('resize', this._handleHeaderResizeWindow);
  }

  _handleHeaderFocusLinkLevel1() {
    this._closeLevel2Menu();
  }

  _handleHeaderKeydownNavLevel2(e) {
    if (e.keyCode === 27) {
      this._closeLevel2Menu();
      e.currentTarget.parentElement.querySelector(`.${this.elementName}__nav-level1-item-tip`).focus();
    }
  }

  _handleHeaderClickTip(e) {
    const list = e.currentTarget.parentElement.querySelector(`.${this.elementName}__nav-level2`);
    if (list) {
      list.classList.toggle(`${this.elementName}__nav-level2-item_expanded`);
    }
  }

  _handleHeaderKeydownTip(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      const list = e.target.parentElement.querySelector(`.${this.elementName}__nav-level2`);
      if (list) {
        list.classList.toggle(`${this.elementName}__nav-level2-item_expanded`);
        const firstItem = list.querySelector('.header__nav-level2-item-link');
        firstItem.focus();
      }
    }
  }

  _handleHeaderResizeWindow() {
    if (this.burger.classList
      .contains(`${this.elementName}__burger-button_active`)) {
      this._handleHeaderClickBurger();
    }
  }

  _handleHeaderClickDoc(e) {
    if (!e.target.closest(`.${this.elementName}__nav-level2`)
      && (!e.target.className.match('tip'))) {
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
    this.content.classList.toggle(`${this.elementName}__content_active`);
  }

  _closeLevel2Menu() {
    this.navLevel2.forEach((item) => item.classList.remove(`${this.elementName}__nav-level2-item_expanded`));
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(`.${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((selector) => {
      string += `.js-${this.elementName}__${selector},`;
    });
    string = string.substring(0, string.length - 1);
    return this.wrapper.querySelectorAll(string);
  }
}

export default Header;
