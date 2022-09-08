class Header {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this._handleHeaderKeydownLevel1 = this._handleHeaderKeydownLevel1.bind(this);
    this._handleHeaderClickLevel2 = this._handleHeaderClickLevel2.bind(this);
    this._handleHeaderClickBurger = this._handleHeaderClickBurger.bind(this);
    this._handleHeaderResizeWindow = this._handleHeaderResizeWindow.bind(this);
    this._handleHeaderClickDoc = this._handleHeaderClickDoc.bind(this);
    this._handleHeaderFocusinDoc = this._handleHeaderFocusinDoc.bind(this);
    this._handleHeaderMouseoverLevel1 = this._handleHeaderMouseoverLevel1.bind(this);

    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.burger = this._getElement('burger-button');
    this.content = this._getElement('content');
    this.navLevel1 = this._getElement('nav-level1');
    this.navLevel2 = this._getElements(['nav-level2']);
    this.menuItemsLevel1 = this._getElements(['nav-level1-item']);
    this.tips = this._getElements(['nav-level1-item-tip']);
    this.linksLevel1 = this._getElements(['__nav-level1-item-link']);
  }

  _bindEventListeners() {
    this.navLevel1.addEventListener('keydown', this._handleHeaderKeydownLevel1);
    this.menuItemsLevel1.forEach((element) => {
      element.addEventListener('mouseover', this._handleHeaderMouseoverLevel1);
    });

    this.linksLevel1.forEach((element) => {
      element.addEventListener('keydown', this._handleHeaderKeydownLevel1);
    });

    this.tips.forEach((element) => {
      element.addEventListener('click', this._handleHeaderClickLevel2);
    });
    this.burger.addEventListener('click', this._handleHeaderClickBurger);
    document.addEventListener('click', this._handleHeaderClickDoc);
    document.addEventListener('focusin', this._handleHeaderFocusinDoc);
    window.addEventListener('resize', this._handleHeaderResizeWindow);
  }

  _handleHeaderMouseoverLevel1(e) {
    const list = e.target.querySelector(`.${this.elementName}__nav-level2`);
    if (list) {
      list.classList.add(`${this.elementName}__nav-level2-item_expanded`);
    }
  }

  _handleHeaderClickLevel2(e) {
    const list = e.currentTarget.parentElement.querySelector(`.${this.elementName}__nav-level2`);
    if (list) {
      list.classList.toggle(`${this.elementName}__nav-level2-item_expanded`);
    }
  }

  _handleHeaderKeydownLevel1(e) {
    if (e.keyCode === 32) {
      e.preventDefault();
      const list = e.target.parentElement.querySelector(`.${this.elementName}__nav-level2`);
      if (list) {
        list.classList.toggle(`${this.elementName}__nav-level2-item_expanded`);
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
