import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const { color } = options;

  const validColors = ['white', 'grey'];

  return {
    elementName: 'logo',
    logoColor: getValidValue(validColors, color, 'white'),
  };
}
