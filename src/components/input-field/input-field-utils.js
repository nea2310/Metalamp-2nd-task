import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
  } = options;

  const elementName = 'input-field';
  const validWidths = ['wide', 'medium', 'medium-narrow'];

  return {
    elementName,
    widthChecked: getValidValue(validWidths, width, 'wide'),
  };
}
