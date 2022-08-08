import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    sliderType,
    min,
    max,
    step,
    from,
    to,
    isMinMaxHidden,
    isFromToHidden,
  } = options;

  const validStates = ['true', 'false'];

  return {
    elementName: 'range-slider',
    isMinMaxHiddenChecked: getValidValue(validStates, isMinMaxHidden, 'true'),
    isFromToHiddenChecked: getValidValue(validStates, isFromToHidden, 'true'),
    sliderTypeChecked: Number.isFinite(sliderType) ? sliderType : 0,
    minChecked: Number.isFinite(min) ? min : 0,
    maxChecked: Number.isFinite(max) ? max : 0,
    stepChecked: Number.isFinite(step) ? step : 0,
    fromChecked: Number.isFinite(from) ? from : 0,
    toChecked: Number.isFinite(to) ? to : 0,
  };
}
