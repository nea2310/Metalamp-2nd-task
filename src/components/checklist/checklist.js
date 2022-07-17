/* eslint-disable no-console */
class CheckList {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.breakPoint = 1199;
    this._handleCheckListMouseDownLabel = this._handleCheckListMouseDownLabel.bind(this);
    this._handleCheckListMouseUpLabel = this._handleCheckListMouseUpLabel.bind(this);
    this._handleCheckListFocusLabel = this._handleCheckListFocusLabel.bind(this);
    this._handleCheckListClickWrapper = this._handleCheckListClickWrapper.bind(this);
    this._handleCheckListFocusWrapper = this._handleCheckListFocusWrapper.bind(this);
    this._handleCheckListResizeLoadWindow = this._handleCheckListResizeLoadWindow.bind(this);
    this._handleCheckListClickFocusDoc = this._handleCheckListClickFocusDoc.bind(this);
    this._needCollapse = this._needCollapse.bind(this);

    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.clickOnList = false;
    this.focusOnList = false;
    this.mouseDown = false;
    this.label = this._getElement('label');
    this.listWrapper = this._getElement('list-wrapper');
    this.clickOnList = false;
  }

  _bindEventListeners() {
    this.wrapper.addEventListener('mousedown', this._handleCheckListMouseDownLabel);
    this.wrapper.addEventListener('mouseup', this._handleCheckListMouseUpLabel);
    this.label.addEventListener('focus', this._handleCheckListFocusLabel);
    this.wrapper.addEventListener('click', this._handleCheckListClickWrapper);
    this.wrapper.addEventListener('focusin', this._handleCheckListFocusWrapper);
    document.addEventListener('click', this._handleCheckListClickFocusDoc);
    document.addEventListener('focusin', this._handleCheckListClickFocusDoc);
    window.addEventListener('resize', this._handleCheckListResizeLoadWindow);
    window.addEventListener('load', this._handleCheckListResizeLoadWindow);
  }

  _handleCheckListMouseDownLabel() {
    this.mouseDown = true;
  }

  _handleCheckListMouseUpLabel(event) {
    if (event.target.closest(`.${this.elementName}__category-wrapper`)) return;
    const isExpanded = this.wrapper.classList.contains(`${this.elementName}_expanded`);
    if (!isExpanded) {
      this._toggleList(true);
    } else if (isExpanded && this._needCollapse()) {
      console.log('_handleCheckListMouseUpLabel');
      this._toggleList(false);
    }
    this.mouseDown = false;
  }

  _handleCheckListFocusLabel() {
    if (!this.wrapper.classList.contains(`${this.elementName}_expanded`)
      && this.mouseDown === false) {
      this._toggleList(true);
    }
  }

  _handleCheckListClickWrapper() {
    console.log('_handleCheckListClickWrapper');

    this.clickOnList = true;
  }

  _handleCheckListFocusWrapper() {
    this.focusOnList = true;
  }

  _handleCheckListClickFocusDoc(e) {
    const isClick = e.type === 'click';
    const checkClickFocus = isClick ? this.clickOnList === false : this.focusOnList === false;
    const setClickFocus = isClick ? this.clickOnList = false : this.focusOnList = false;
    if (this._needCollapse()) {
      if (e.target.closest(`.${this.elementName}` == null)
        || checkClickFocus) {
        console.log('_handleCheckListClickFocusDoc');
        this._toggleList(false);
      } else {
        return setClickFocus;
      }
    }
    return true;
  }

  _handleCheckListResizeLoadWindow() {
    if (!this._isCollapsing()) {
      console.log(this._isCollapsing());
      console.log(window.innerWidth);
      console.log(this.breakPoint);

      if (window.innerWidth > this.breakPoint) {
        this._toggleList(true);
        console.log('1');

        this.wrapper.classList.remove(`${this.elementName}_temporarily-collapsing`);
      } else {
        this._toggleList(false);
        console.log('2');
        this.wrapper.classList.add(`${this.elementName}_temporarily-collapsing`);
      }
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }

  _isCollapsing() {
    return this.wrapper.classList.contains(`${this.elementName}_collapsing`);
  }

  _needCollapse() {
    return (
      window.innerWidth <= this.breakPoint || this._isCollapsing());
  }

  _toggleList(flag) {
    if (flag) {
      this.wrapper.classList.add(`${this.elementName}_expanded`);
    } else {
      this.wrapper.classList.remove(`${this.elementName}_expanded`);
    }
  }
}

function renderCheckLists(selector) {
  const checkLists = document.querySelectorAll(selector);
  checkLists.forEach((checkList) => new CheckList(selector, checkList));
}
renderCheckLists('.js-checklist');
