import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    backgroundColor,
    logoColor,
  } = options;

  const validBackgroundColors = ['white', 'grey'];
  const validLogoColors = ['grey', 'purple'];

  const logoColorChecked = getValidValue(validLogoColors, logoColor, 'white');

  return {
    elementName: 'logo',
    backgroundColorChecked: getValidValue(validBackgroundColors, backgroundColor, 'white'),
    logoColorChecked,
  };
}
