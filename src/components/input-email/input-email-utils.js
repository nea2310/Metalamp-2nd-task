import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
    hasArrow,
  } = options;

  const elementName = 'input-email';

  const validWidths = ['wide', 'medium', 'medium-narrow'];
  const arrowModifier = hasArrow ? ` ${elementName}__input_with-arrow` : '';

  return {
    elementName,
    arrowModifier,
    widthChecked: getValidValue(validWidths, width, 'wide'),
  };
}
