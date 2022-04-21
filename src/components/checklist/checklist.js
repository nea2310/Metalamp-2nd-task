import './checklist.scss';

class CheckList {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
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
    this.label = this._getElem('label');
    this.listWrapper = this._getElem('list-wrapper');
    this.tip = this._getElem('image');
    this.clickOnList = false;
  }

  _bindEventListeners() {
    // клик по лейблу
    this.label.addEventListener('mousedown', this._handleCheckListMouseDownLabel);
    this.label.addEventListener('mouseup', this._handleCheckListMouseUpLabel);

    // фокус на лейбл
    this.label.addEventListener('focus', this._handleCheckListFocusLabel);

    // проверка, клик был снаружи или внутри списка
    this.wrapper.addEventListener('click', this._handleCheckListClickWrapper);

    // проверка, фокус был снаружи или внутри списка
    this.wrapper.addEventListener('focusin', this._handleCheckListFocusWrapper);

    // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
    document.addEventListener('click', this._handleCheckListClickFocusDoc);

    // отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
    document.addEventListener('focusin', this._handleCheckListClickFocusDoc);

    // ресайз/лоад страницы
    window.addEventListener('resize', this._handleCheckListResizeLoadWindow);
    window.addEventListener('load', this._handleCheckListResizeLoadWindow);
  }

  _handleCheckListMouseDownLabel() {
    this.mouseDown = true;
  }

  _handleCheckListMouseUpLabel() {
    const isHidden = this.listWrapper.classList.contains(`${this.elemName}__list-wrapper_hidden`);
    if (isHidden) {
      this._toggleList(true);
    } else if (!isHidden && this._needCollapse()) {
      this._toggleList(false);
    }
    this.mouseDown = false;
  }

  _handleCheckListFocusLabel() {
    if (this.listWrapper.classList.contains(`${this.elemName}__list-wrapper_hidden`)
      && this.mouseDown === false) {
      this._toggleList(true);
    }
  }

  _handleCheckListClickWrapper() {
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
      if (e.target.closest(`.${this.elemName}` == null)
        || checkClickFocus) {
        this._toggleList(false);
      } else {
        return setClickFocus;
      }
    }
    return true;
  }

  _handleCheckListResizeLoadWindow() {
    if (window.innerWidth > this.breakPoint && !this._isCollapsing()) {
      this._toggleList(true);
    } else this._toggleList(false);
  }

  _getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elemName}__${selector}`);
  }

  _isCollapsing() {
    return this.label.classList.contains(`${this.elemName}__label_collapsing`);
  }

  _needCollapse() {
    return (
      window.innerWidth <= this.breakPoint || this._isCollapsing());
  }

  // Открывание/ закрывание списка
  _toggleList(flag) {
    const wrap = `${this.elemName}__`;
    if (flag) {
      this.listWrapper.classList
        .remove(`${wrap}list-wrapper_hidden`);
      this.tip.classList.add(`${wrap}image-expanded`);
      this.tip.classList.remove(`${wrap}image_collapsed`);
    } else {
      this.listWrapper.classList
        .add(`${wrap}list-wrapper_hidden`);
      this.tip.classList.remove(`${wrap}image-expanded`);
      this.tip.classList.add(`${wrap}image_collapsed`);
    }
  }
}

function renderCheckLists(selector) {
  const checkLists = document.querySelectorAll(selector);
  checkLists.forEach((checkList) => new CheckList(selector, checkList));
}
renderCheckLists('.js-checklist');
