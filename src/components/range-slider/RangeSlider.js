/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import 'ion-rangeslider/js/ion.rangeSlider.min';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

class RangeSlider {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._render();
  }

  _render() {
    this.slider = this._getElement('slider');
    this.priceFrom = this._getElement('price-from');
    this.priceTo = this._getElement('price-to');
    this._init();
  }

  _init() {
    const { priceFrom, priceTo } = this;
    const displayPrice = (data) => {
      const { from, to } = data;
      priceFrom.value = `${from.toLocaleString()}₽`;
      priceTo.value = `${to.toLocaleString()}₽`;
      const priceFromWidth = this._getInputWidth(priceFrom.value);
      const priceToWidth = this._getInputWidth(priceTo.value);

      priceFrom.style.width = `${priceFromWidth}px`;
      priceTo.style.width = `${priceToWidth}px`;
      console.log(priceFrom.value);
    };

    $(this.slider).ionRangeSlider({
      onStart(data) {
        displayPrice(data);
      },
      onChange(data) {
        displayPrice(data);
      },
    });

    const instance = $(this.slider).data('ionRangeSlider');
    const updatePrice = (e, inputType, valueType) => {
      const value = inputType.value.replace(/\D/g, '');
      instance.update({
        [valueType]: value,
      });
      const input = inputType;
      input.style.width = `${(inputType.value.length)}px`;
      if (e.type === 'change') {
        input.value = `${parseInt(value, 10).toLocaleString()}₽`;
        input.style.width = `${(inputType.value.length)}px`;
      }
    };

    const handleChangePriceFrom = (e) => {
      updatePrice(e, this.priceFrom, 'from');
    };
    const handleChangePriceTo = (e) => {
      updatePrice(e, this.priceTo, 'to');
    };

    this.priceFrom.addEventListener('keyup', handleChangePriceFrom);
    this.priceFrom.addEventListener('change', handleChangePriceFrom);
    this.priceTo.addEventListener('keyup', handleChangePriceTo);
    this.priceTo.addEventListener('change', handleChangePriceTo);
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

  _getInputWidth(text) {
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
