import getElement from '../../shared/utils/getElement';

class CheckList {
  constructor(element, elementName = 'checklist') {
    this.elementName = elementName;
    this.wrapper = element;
    this.breakPoint = 1199;

    this._bindEventListeners();
    this._render();
  }

  /* Для события mousedown действием по-умолчанию является установка фокуса.
  Если отменить событие mousedown, то фокусирования не произойдёт =>
  при клике одновременно с ним не сработает фокус и выпадающий список раскроется */
  static _handleCheckListMousedownLabel(event) {
    event.preventDefault();
  }

  _render() {
    this.label = getElement('label', this.wrapper, this.elementName);
    this.listWrapper = getElement('list-wrapper', this.wrapper, this.elementName);

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleCheckListClickLabel = this._handleCheckListClickLabel.bind(this);
    this._handleCheckListFocusLabel = this._handleCheckListFocusLabel.bind(this);
    this._handleCheckListClickFocusDocument = this._handleCheckListClickFocusDocument.bind(this);
    this._handleCheckListResizeLoadWindow = this._handleCheckListResizeLoadWindow.bind(this);
  }

  _addEventListeners() {
    this.label.addEventListener('click', this._handleCheckListClickLabel);
    this.label.addEventListener('focus', this._handleCheckListFocusLabel);
    this.label.addEventListener('mousedown', CheckList._handleCheckListMousedownLabel);
    document.addEventListener('click', this._handleCheckListClickFocusDocument);
    document.addEventListener('focusin', this._handleCheckListClickFocusDocument);
    window.addEventListener('resize', this._handleCheckListResizeLoadWindow);
    window.addEventListener('load', this._handleCheckListResizeLoadWindow);
  }

  _handleCheckListClickLabel() {
    if (this._isCollapsing()) { this.wrapper.classList.toggle(`${this.elementName}_expanded`); }
  }

  _handleCheckListFocusLabel() {
    if (this._isCollapsing()) { this.wrapper.classList.add(`${this.elementName}_expanded`); }
  }

  _handleCheckListClickFocusDocument(event) {
    const condition = !event.target.closest(`.js-${this.elementName}`)
      || (event.target !== this.label && !event.target.closest(`.js-${this.elementName}__list-wrapper`) && event.target.closest(`.js-${this.elementName}`));

    if (condition && this._isCollapsing()) {
      this.wrapper.classList.remove(`${this.elementName}_expanded`);
    }
  }

  _handleCheckListResizeLoadWindow() {
    if (window.innerWidth > this.breakPoint && !this.wrapper.classList.contains(`${this.elementName}_collapsing`)) {
      this.wrapper.classList.add(`${this.elementName}_expanded`);
      this.wrapper.classList.remove(`${this.elementName}_temporarily-collapsing`);
      this.label.setAttribute('tabindex', -1);
    } else {
      this.wrapper.classList.remove(`${this.elementName}_expanded`);
      this.wrapper.classList.add(`${this.elementName}_temporarily-collapsing`);
      this.label.setAttribute('tabindex', 0);
    }
  }

  _isCollapsing() {
    return this.wrapper.classList.contains(`${this.elementName}_collapsing`)
      || this.wrapper.classList.contains(`${this.elementName}_temporarily-collapsing`);
  }
}

export default CheckList;
