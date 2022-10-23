class InfoSign {
  constructor(element, elementName = 'info-sign') {
    this.wrapper = element;
    this.elementName = elementName;

    this._bindEventListeners();
    this._render();
  }

  _render() {
    this.message = this.wrapper.querySelector('.js-info-sign__text');

    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleWrapperClick = this._handleWrapperClick.bind(this);
    this._handleWrapperBlur = this._handleWrapperBlur.bind(this);
  }

  _addEventListeners() {
    this.wrapper.addEventListener('click', this._handleWrapperClick);
    this.wrapper.addEventListener('keydown', this._handleWrapperClick);
    this.message.addEventListener('blur', this._handleWrapperBlur);
  }

  _handleWrapperClick(event) {
    const condition = event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter');
    if (condition) {
      this.message.classList.add('info-sign__text_active');
    }
    this.message.focus();
  }

  _handleWrapperBlur() {
    this.message.classList.remove('info-sign__text_active');
  }
}

export default InfoSign;
