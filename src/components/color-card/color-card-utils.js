import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const { color } = options;

  const validColors = ['dark-shade-100',
    'dark-shade-75',
    'dark-shade-50',
    'dark-shade-25',
    'dark-shade-5',
    'purple',
    'green'];

  return {
    elementName: 'color-card',
    colorChecked: getValidValue(validColors, color, 'button'),
  };
}
