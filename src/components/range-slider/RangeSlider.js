import '../../../vendors/slider-metalamp/plugin';
import '../../../vendors/slider-metalamp/plugin.css';

class RangeSlider {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.regexp = /\D/g;
    this._render();
  }

  _render() {
    this.slider = this._getElement('slider');
    this.priceFrom = this._getElement('price-from');
    this.priceTo = this._getElement('price-to');
    this.from = Number(this.priceFrom.value.replace(this.regexp, ''));
    this.to = Number(this.priceTo.value.replace(this.regexp, ''));

    this._handleChangePriceFrom = this._handleChangePriceFrom.bind(this);
    this._handleChangePriceTo = this._handleChangePriceTo.bind(this);
    this._updatePrice = this._updatePrice.bind(this);

    this._init();
    this._bindEventListeners();
  }

  _init() {
    const { priceFrom, priceTo } = this;

    const displayPrice = (data) => {
      const { from, to } = data;
      priceFrom.value = `${from.toLocaleString()}₽`;
      priceTo.value = `${to.toLocaleString()}₽`;
      const priceFromWidth = RangeSlider._getInputWidth(priceFrom.value);
      const priceToWidth = RangeSlider._getInputWidth(priceTo.value);

      priceFrom.style.width = `${priceFromWidth}px`;
      priceTo.style.width = `${priceToWidth}px`;
    };

    this.rangeSlider = $('.js-slider-metalamp').SliderMetaLamp(
      {
        onStart(data) {
          displayPrice(data);
        },
        onChange(data) {
          displayPrice(data);
        },
      },
    ).data('SliderMetaLamp');
  }

  _bindEventListeners() {
    this.priceFrom.addEventListener('input', RangeSlider._handleInput);
    this.priceTo.addEventListener('input', RangeSlider._handleInput);

    this.priceFrom.addEventListener('keyup', this._handleChangePriceFrom);
    this.priceFrom.addEventListener('change', this._handleChangePriceFrom);
    this.priceTo.addEventListener('keyup', this._handleChangePriceTo);
    this.priceTo.addEventListener('change', this._handleChangePriceTo);
  }

  static _handleInput(e) {
    e.target.value = e.target.value.replace(this.regexp, '');
  }

  _handleChangePriceFrom(e) {
    this.from = Number(e.target.value);
    this._updatePrice(e, this.priceFrom, 'from');
  }

  _handleChangePriceTo(e) {
    this.to = Number(e.target.value);
    if (this.from <= this.to) { this._updatePrice(e, this.priceTo, 'to'); }
  }

  _updatePrice(e, inputType, valueType) {
    const value = inputType.value.replace(this.regexp, '');
    this.rangeSlider.update({
      [valueType]: value,
    });
    const input = inputType;
    if (e.type === 'change') {
      input.value = `${parseInt(value, 10).toLocaleString()}₽`;
      input.style.width = RangeSlider._getInputWidth(input.value);
    }
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
    return this.wrapper
      .querySelectorAll(string);
  }

  static _getInputWidth(text) {
    const element = document.createElement('span');
    element.style.fontSize = '12px';
    element.style.fontFamily = 'Montserrat';
    element.innerHTML = text;
    const html = document.querySelector('html');
    html.appendChild(element);
    const result = element.offsetWidth;
    html.removeChild(element);
    return result;
  }
}

export default RangeSlider;
