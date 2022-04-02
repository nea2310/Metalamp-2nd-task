import './range-slider.scss';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import 'ion-rangeslider/js/ion.rangeSlider.min.js';

class RangeSlider {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.render();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(
      `.${this.elemName}__${selector}`,
    );
  }

  getElems(selectors) {
    let sel = '';
    for (const selector of selectors) {
      sel += `.${this.elemName}__${selector},`;
    }
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper.querySelectorAll(sel);
  }

  render() {
    this.slider = this.getElem('slider');
    this.priceFrom = this.getElem('price-from');
    this.priceTo = this.getElem('price-to');
    this.init();
  }

  init() {
    const { priceFrom } = this;
    const { priceTo } = this;
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
      const val = inputType.value.replace(/\D/g, '');
      instance.update({
        [valueType]: val,
      });

      inputType.style.width = `${(inputType.value.length) * 7.7}px`;
      if (e.type === 'change') {
        inputType.value = `${parseInt(val).toLocaleString()}₽`;
        inputType.style.width = `${(inputType.value.length) * 7.7}px`;
      }
    };

    this.priceFrom.addEventListener('keyup', (e) => {
      updatePrice(e, this.priceFrom, 'from');
    });
    this.priceFrom.addEventListener('change', (e) => {
      updatePrice(e, this.priceFrom, 'from');
    });

    this.priceTo.addEventListener('keyup', (e) => {
      updatePrice(e, this.priceTo, 'to');
    });
    this.priceTo.addEventListener('change', (e) => {
      updatePrice(e, this.priceTo, 'to');
    });
  }
}

function renderRangeSliders(selector) {
  const rangeSliders = document.querySelectorAll(selector);
  for (const rangeSlider of rangeSliders) {
    new RangeSlider(selector, rangeSlider);
  }
}
renderRangeSliders('.js-range-slider');
