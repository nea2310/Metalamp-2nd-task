class InfoSign {
  constructor(elementName, element) {
    this.wrapper = element;
    this.elementName = elementName.replace(/^.js-/, '');
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.message = this.wrapper.querySelector('.js-info-sign__text');
    this._handleWrapperClick = this._handleWrapperClick.bind(this);
    this._handleWrapperBlur = this._handleWrapperBlur.bind(this);
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

  _bindEventListeners() {
    this.wrapper.addEventListener('click', this._handleWrapperClick);
    this.wrapper.addEventListener('keydown', this._handleWrapperClick);
    this.message.addEventListener('blur', this._handleWrapperBlur);
  }
}

export default InfoSign;
