import './checklist.scss';

class CheckList {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.breakPoint = 1199;
    this.handleMouseDownLabel = this.handleMouseDownLabel.bind(this);
    this.handleMouseUpLabel = this.handleMouseUpLabel.bind(this);
    this.handleFocusLabel = this.handleFocusLabel.bind(this);
    this.handleInnerClick = this.handleInnerClick.bind(this);
    this.handleInnerFocus = this.handleInnerFocus.bind(this);
    this.needCollapse = this.needCollapse.bind(this);
    this.handleResizeLoad = this.handleResizeLoad.bind(this);
    this.handleOuterClickFocus = this.handleOuterClickFocus.bind(this);

    this.render();
    this.clickLabel();
    this.focusLabel();
    this.innerClick();
    this.outerClick();
    this.innerFocus();
    this.outerFocus();
    this.resizeLoad();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elemName}__${selector}`);
  }

  render() {
    this.clickOnList = false;
    this.focusOnList = false;
    this.mouseDown = false;
    this.label = this.getElem('label');
    this.listWrapper = this.getElem('list-wrapper');
    this.tip = this.getElem('img');
    this.clickOnList = false;
  }

  isCollapsing() {
    return this.label.classList.contains(`${this.elemName}__label_collapsing`);
  }

  needCollapse() {
    return (
      window.innerWidth <= this.breakPoint || this.isCollapsing());
  }

  handleResizeLoad() {
    if (window.innerWidth > this.breakPoint && !this.isCollapsing()) {
      this.toggleList(true);
    } else this.toggleList(false);
  }

  // Открывание/ закрывание дропдауна
  toggleList(flag) {
    const wrap = `${this.elemName}__`;
    if (flag) {
      this.listWrapper.classList
        .remove(`${wrap}list-wrapper_hidden`);
      this.tip.classList.add(`${wrap}img-expanded`);
      this.tip.classList.remove(`${wrap}img_collapsed`);
    } else {
      this.listWrapper.classList
        .add(`${wrap}list-wrapper_hidden`);
      this.tip.classList.remove(`${wrap}img-expanded`);
      this.tip.classList.add(`${wrap}img_collapsed`);
    }
  }

  handleMouseDownLabel() {
    this.mouseDown = true;
  }

  handleMouseUpLabel() {
    const isHidden = this.listWrapper.classList.contains(`${this.elemName}__list-wrapper_hidden`);
    if (isHidden) {
      this.toggleList(true);
    } else if (!isHidden && this.needCollapse()) {
      this.toggleList(false);
    }
    this.mouseDown = false;
  }

  handleFocusLabel() {
    if (this.listWrapper.classList.contains(`${this.elemName}__list-wrapper_hidden`)
      && this.mouseDown === false) {
      this.toggleList(true);
    }
  }

  handleInnerClick() {
    this.clickOnList = true;
  }

  handleInnerFocus() {
    this.focusOnList = true;
  }

  handleOuterClickFocus(e) {
    const isClick = e.type === 'click';
    const checkClickFocus = isClick ? this.clickOnList === false : this.focusOnList === false;
    const setClickFocus = isClick ? this.clickOnList = false : this.focusOnList = false;
    if (this.needCollapse()) {
      if (e.target.closest(`.${this.elemName}` == null)
        || checkClickFocus) {
        this.toggleList(false);
      } else {
        return setClickFocus;
      }
    }
    return true;
  }

  // ресайз/лоад страницы
  resizeLoad() {
    window.addEventListener('resize', this.handleResizeLoad);
    window.addEventListener('load', this.handleResizeLoad);
  }

  // клик по лейблу
  clickLabel() {
    this.label.addEventListener('mousedown', this.handleMouseDownLabel);
    this.label.addEventListener('mouseup', this.handleMouseUpLabel);
  }

  // фокус на лейбл
  focusLabel() {
    this.label.addEventListener('focus', this.handleFocusLabel);
  }

  // проверка, клик был снаружи или внутри списка
  innerClick() {
    this.wrapper.addEventListener('click', this.handleInnerClick);
  }

  // проверка, фокус был снаружи или внутри списка
  innerFocus() {
    this.wrapper.addEventListener('focusin', this.handleInnerFocus);
  }

  // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
  outerClick() {
    document.addEventListener('click', this.handleOuterClickFocus);
  }

  // отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
  outerFocus() {
    document.addEventListener('focusin', this.handleOuterClickFocus);
  }
}

function renderCheckLists(selector) {
  const checkLists = document.querySelectorAll(selector);
  checkLists.forEach((checkList) => new CheckList(selector, checkList));
}
renderCheckLists('.js-checklist');
