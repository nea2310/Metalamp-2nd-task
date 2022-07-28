import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const { style } = options;

  const validStyles = ['h1', 'h2', 'h3', 'body'];

  return {
    elementName: 'type-card',
    styleChecked: getValidValue(validStyles, style, 'h1'),
  };
}
