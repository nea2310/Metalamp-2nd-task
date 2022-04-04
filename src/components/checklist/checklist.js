import './checklist.scss';

class CheckList {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.breakPoint = 1199;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleCheckFocus = this.handleCheckFocus.bind(this);
    this.handleOuterClick = this.handleOuterClick.bind(this);
    this.handleOuterFocus = this.handleOuterFocus.bind(this);
    this.checkCollapse = this.checkCollapse.bind(this);
    this.render();
    this.clickInput();
    this.focusInput();
    this.insideListClick();
    this.collapseByClick();
    this.insideListFocus();
    this.collapseByFocus();
    this.hideShowList();
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

  checkCollapse() {
    const wrap = `${this.elemName}__`;
    return (
      this.label.classList.contains(`${wrap}label_collapsing`)
      || window.innerWidth <= this.breakPoint);
  }

  hideShowList() {
    const handleWindowResize = () => {
      if (window.innerWidth <= this.breakPoint) {
        this.toggle(false);
      } else if (this.wrapper.classList
        .contains(`${this.elemName}_collapsing`) === true) {
        this.toggle(false);
      } else if (this.wrapper.classList
        .contains(`${this.elemName}_expanded`) === true) {
        this.toggle(true);
      }
    };

    const handleLoad = () => {
      if (window.innerWidth <= this.breakPoint && this.wrapper.classList
        .contains(`${this.elemName}_collapsing`) === false) {
        this.toggle(false);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('load', handleLoad);
  }

  // Открывание/ закрывание дропдауна
  toggle(flag) {
    const wrap = `${this.elemName}__`;
    if (this.label.classList.contains(`${wrap}label_collapsing`)
      || this.label.classList.contains(`${wrap}label_expanded`)) {
      if (flag) {
        this.listWrapper.classList
          .remove(`${wrap}list-wrapper_hidden`);
        this.tip.classList.add(`${wrap}img-expanded`);
        this.tip.classList.remove(`${wrap}img_collapsed`);
      }





      else {
        this.listWrapper.classList
          .add(`${wrap}list-wrapper_hidden`);
        this.tip.classList.remove(`${wrap}img-expanded`);
        this.tip.classList.add(`${wrap}img_collapsed`);
      }
    }
  }

  handleMouseDown() {
    this.mouseDown = true;
  }

  handleMouseUp() {
    if (this.checkCollapse()) {
      this.toggle(true);
      this.mouseDown = false;
    }
  }

  handleFocus() {
    if (this.listWrapper.classList
      .contains(`${this.elemName}__list-wrapper_hidden`)
      && this.mouseDown === false) {
      this.toggle(true);
    }
  }

  handleCheckClick() {
    this.clickOnList = true;
  }

  handleCheckFocus() {
    this.focusOnList = true;
  }

  handleOuterClick(e) {
    if (this.checkCollapse()) {
      if (e.target.closest(`.${this.elemName}` == null)
        || this.clickOnList === false) {
        this.toggle(false);
      } else {
        this.clickOnList = false;
      }
    }
  }

  handleOuterFocus(e) {
    if (this.checkCollapse()) {
      if (e.target.closest(`.${this.elemName}` == null)
        || this.focusOnList === false) {
        this.toggle(false);
      } else {
        this.focusOnList = false;
      }
    }
  }

  // клик по лейблу
  clickInput() {
    this.label.addEventListener('mousedown', this.handleMouseDown);
    this.label.addEventListener('mouseup', this.handleMouseUp);
  }

  // фокус на лейбл
  focusInput() {
    this.label.addEventListener('focus', this.handleFocus);
  }

  // проверка, клик был снаружи или внутри списка
  insideListClick() {
    this.wrapper.addEventListener('click', this.handleCheckClick);
  }

  // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
  collapseByClick() {
    document.addEventListener('click', this.handleOuterClick);
  }

  // проверка, фокус был снаружи или внутри списка
  insideListFocus() {
    this.wrapper.addEventListener('focusin', this.handleCheckFocus);
  }

  // отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
  collapseByFocus() {
    document.addEventListener('focusin', this.handleOuterFocus);
  }
}

function renderCheckLists(selector) {
  const checkLists = document.querySelectorAll(selector);
  checkLists.forEach((checkList) => new CheckList(selector, checkList));
}
renderCheckLists('.js-checklist');
