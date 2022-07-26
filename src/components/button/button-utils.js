import { getValidValue, checkType } from '../../utils/helpers';

export default function prepareOptions(options) {
  const {
    type,
    length,
    width,
    color,
    href,
    hasArrow,
  } = options;

  const validTypes = ['button', 'submit', 'link', 'plain-text'];
  const validLengths = ['very-long', 'long', 'short', 'very-short'];
  const validWidths = ['wide', 'narrow'];
  const validColors = ['dark', 'light'];
  const elementName = 'button';

  return {
    elementName,
    arrowModifier: hasArrow ? `${elementName}_has-arrow` : '',
    typeChecked: getValidValue(validTypes, type, 'button'),
    lengthChecked: getValidValue(validLengths, length, 'short'),
    widthChecked: getValidValue(validWidths, width, 'wide'),
    colorChecked: getValidValue(validColors, color, 'dark'),
    hrefChecked: checkType('string', href, 'https://test/test'),
  };
}

export { prepareOptions };
