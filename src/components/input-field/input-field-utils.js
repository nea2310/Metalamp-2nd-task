import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
    validation,
    hasArrow,
  } = options;

  const elementName = 'input-field';

  const validWidths = ['wide', 'medium', 'medium-narrow'];
  const validationTypes = ['date', 'email'];
  const arrowModifier = hasArrow ? ` ${elementName}__input_with-arrow` : '';

  return {
    elementName,
    arrowModifier,
    widthChecked: getValidValue(validWidths, width, 'wide'),
    validationChecked: getValidValue(validationTypes, validation),
  };
}
