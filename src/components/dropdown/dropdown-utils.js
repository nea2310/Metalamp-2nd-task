import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
  } = options;

  const validWidths = ['wide', 'narrow'];
  const elementName = 'dropdown';

  const widthChecked = getValidValue(validWidths, width, 'wide');

  return {
    elementName,
    inputWidth: `_width_${widthChecked}`,
    minus: '-',
    plus: '+',
  };
}
