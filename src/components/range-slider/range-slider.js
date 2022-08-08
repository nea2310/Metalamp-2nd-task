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
      priceFrom.style.width = `${(priceFrom.value.length) * 7.7}px`;
      priceTo.style.width = `${(priceTo.value.length) * 7.7}px`;
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
      input.style.width = `${(inputType.value.length) * 7.7}px`;
      if (e.type === 'change') {
        input.value = `${parseInt(value, 10).toLocaleString()}₽`;
        input.style.width = `${(inputType.value.length) * 7.7}px`;
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
    return wrapper.querySelector(
      `.${this.elementName}__${selector}`,
    );
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((selector) => { string += `.js-${this.elementName}__${selector},`; });
    string = string.substring(0, string.length - 1);
    return this.wrapper
      .querySelectorAll(string);
  }
}

function renderRangeSliders(selector) {
  const rangeSliders = document.querySelectorAll(selector);
  rangeSliders.forEach((rangeSlider) => new RangeSlider(selector, rangeSlider));
}
renderRangeSliders('.js-range-slider');
