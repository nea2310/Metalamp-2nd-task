import getValidValue from '../../shared/helpers/getValidValue';
import isNumber from '../../shared/helpers/isNumber';

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
    sliderTypeChecked: isNumber(sliderType),
    minChecked: isNumber(min),
    maxChecked: isNumber(max),
    stepChecked: isNumber(step),
    fromChecked: isNumber(from),
    toChecked: isNumber(to),
  };
}
