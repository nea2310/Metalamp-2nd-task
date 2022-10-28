import FontFaceObserver from 'fontfaceobserver';

import '../../../vendors/slider-metalamp/plugin';
import '../../../vendors/slider-metalamp/plugin.css';
import getElement from '../../shared/utils/getElement';

class RangeSlider {
  constructor(element, elementName = 'range-slider') {
    this.elementName = elementName;
    this.wrapper = element;
    this.regexp = /\D/g;

    this._bindEventListeners();
    this._render();
  }

  static _handleInput(e) {
    e.target.value = e.target.value.replace(this.regexp, '');
  }

  _render() {
    this.slider = getElement('slider', this.wrapper, this.elementName);
    this.priceFrom = getElement('price-from', this.wrapper, this.elementName);
    this.priceTo = getElement('price-to', this.wrapper, this.elementName);
    this.from = Number(this.priceFrom.value.replace(this.regexp, ''));
    this.to = Number(this.priceTo.value.replace(this.regexp, ''));
    this.measureTextBox = getElement('measure-text-length', this.wrapper, this.elementName);

    this._init();
    this._addEventListeners();
  }

  _init() {
    const { priceFrom, priceTo } = this;

    const fontObserver = new FontFaceObserver('Montserrat');

    const displayPrice = (data) => {
      const { from, to } = data;
      priceFrom.value = `${from.toLocaleString()}₽`;
      priceTo.value = `${to.toLocaleString()}₽`;

      fontObserver.load().then(() => {
        const priceFromWidth = this._getInputWidth(priceFrom.value);
        const priceToWidth = this._getInputWidth(priceTo.value);

        priceFrom.style.width = `${priceFromWidth}px`;
        priceTo.style.width = `${priceToWidth}px`;
      })
        // eslint-disable-next-line no-console
        .catch(() => console.log('Font Montserrat is not available'));
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
    this._handleChangePriceFrom = this._handleChangePriceFrom.bind(this);
    this._handleChangePriceTo = this._handleChangePriceTo.bind(this);
    this._updatePrice = this._updatePrice.bind(this);
  }

  _addEventListeners() {
    this.priceFrom.addEventListener('input', RangeSlider._handleInput);
    this.priceTo.addEventListener('input', RangeSlider._handleInput);

    this.priceFrom.addEventListener('keyup', this._handleChangePriceFrom);
    this.priceFrom.addEventListener('change', this._handleChangePriceFrom);
    this.priceTo.addEventListener('keyup', this._handleChangePriceTo);
    this.priceTo.addEventListener('change', this._handleChangePriceTo);
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
      input.style.width = this._getInputWidth(input.value);
    }
  }

  _getInputWidth(text) {
    this.measureTextBox.innerHTML = text;
    return this.measureTextBox.offsetWidth;
  }
}

export default RangeSlider;
