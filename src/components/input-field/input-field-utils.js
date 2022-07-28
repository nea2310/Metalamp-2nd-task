import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
    validation,
  } = options;

  const validWidths = ['wide', 'medium', 'medium-narrow'];
  const validationTypes = ['date', 'email'];

  return {
    elementName: 'input-field',
    widthChecked: getValidValue(validWidths, width, 'wide'),
    validationChecked: getValidValue(validationTypes, validation),
  };
}
