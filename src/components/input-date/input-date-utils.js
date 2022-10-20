import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
    placeholderColor,
  } = options;

  const elementName = 'input-date';
  const validWidths = ['wide', 'medium', 'medium-narrow'];
  const validColors = ['light', 'dark'];

  return {
    elementName,
    widthChecked: getValidValue(validWidths, width, 'wide'),
    placeholderColorChecked: getValidValue(validColors, placeholderColor, 'light'),
  };
}
