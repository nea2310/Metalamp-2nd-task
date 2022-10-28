import getElement from '../../shared/utils/getElement';
import getElements from '../../shared/utils/getElements';

class Header {
  constructor(element, elementName = 'header') {
    this.elementName = elementName;
    this.wrapper = element;

    this._bindEventListeners();
    this._render();
  }

  _render() {
    this.burger = getElement('burger-button', this.wrapper, this.elementName);
    this.content = getElement('content', this.wrapper, this.elementName);
    this.navLevel1 = getElement('nav-level1', this.wrapper, this.elementName);
    this.navLevel2 = getElements(['nav-level2'], this.wrapper, this.elementName);
    this.tips = getElements(['nav-level1-item-tip'], this.wrapper, this.elementName);
    this.linksLevel1 = getElements(['nav-level1-item-link'], this.wrapper, this.elementName);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleHeaderKeydownTip = this._handleHeaderKeydownTip.bind(this);
    this._handleHeaderClickTip = this._handleHeaderClickTip.bind(this);
    this._handleHeaderClickBurger = this._handleHeaderClickBurger.bind(this);
    this._handleHeaderResizeWindow = this._handleHeaderResizeWindow.bind(this);
    this._handleHeaderClickDocument = this._handleHeaderClickDocument.bind(this);
    this._handleHeaderFocusinDocument = this._handleHeaderFocusinDocument.bind(this);
    this._handleHeaderFocusLinkLevel1 = this._handleHeaderFocusLinkLevel1.bind(this);
    this._handleHeaderKeydownNavLevel2 = this._handleHeaderKeydownNavLevel2.bind(this);
  }

  _addEventListeners() {
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
    document.addEventListener('click', this._handleHeaderClickDocument);
    document.addEventListener('focusin', this._handleHeaderFocusinDocument);
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

  _handleHeaderClickDocument(event) {
    const element = event.target;

    if (!element) return;

    const condition = (!element.closest(`.${this.elementName}__nav-level2`)
      && (!element.classList.contains(`js-${this.elementName}__nav-level1-item-tip`)));
    if (element.className) {
      if (condition) {
        this._closeLevel2Menu();
      }
    }
  }

  _handleHeaderFocusinDocument(event) {
    const element = event.target;

    if (!element) return;

    if (!element.classList.contains(`js-${this.elementName}__nav-level2-item-link`)) {
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
}

export default Header;
