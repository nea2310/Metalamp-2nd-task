import RangeSlider from './RangeSlider';

function renderRangeSliders(selector) {
  const rangeSliders = document.querySelectorAll(selector);
  rangeSliders.forEach((rangeSlider) => new RangeSlider(selector, rangeSlider));
}
renderRangeSliders('.js-range-slider');