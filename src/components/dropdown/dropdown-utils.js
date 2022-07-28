import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    type,
    width,
  } = options;

  const validWidths = ['wide', 'narrow'];
  const validTypes = ['dropDownGuests', 'dropDownRooms'];
  const elementName = 'dropdown';

  const typeChecked = getValidValue(validTypes, type, 'dropDownGuests');
  const widthChecked = getValidValue(validWidths, width, 'wide');

  return {
    elementName,
    inputWidth: `_width_${widthChecked}`,
    inputStyle: typeChecked === 'dropDownRooms' ? '_not-rounded' : '_rounded',
    minus: '-',
    plus: '+',
  };
}
