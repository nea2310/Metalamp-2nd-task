import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const { type } = options;
  const validTypes = ['dateDropDown', 'filterDateDropDown'];
  const elementName = 'date-dropdown';

  return {
    elementName,
    typeChecked: getValidValue(validTypes, type, 'dateDropDown'),
    modifier: type === 'filterDateDropDown' ? `${elementName}__calendar-wrapper_width_narrow` : '',
    width: type === 'filterDateDropDown' ? '_width_narrow' : '_width_wide',
  };
}
