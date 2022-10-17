import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    type,
    visibility,
  } = options;

  const validTypes = ['dateDropDown', 'filterDateDropDown'];
  const validVisibilities = [true, false];
  const elementName = 'date-dropdown';

  const visibilityChecked = getValidValue(validVisibilities, visibility, false);
  const modifiers = [];

  if (type === 'filterDateDropDown') {
    modifiers.push(`${elementName}__calendar-wrapper_width_narrow`);
  }

  if (!visibilityChecked) {
    modifiers.push(`${elementName}__calendar-wrapper_hidden`);
  }

  return {
    elementName,
    typeChecked: getValidValue(validTypes, type, 'dateDropDown'),
    width: type === 'filterDateDropDown' ? '_width_narrow' : '_width_wide',
    modifiers: modifiers.reduce((string, element) => `${string} ${element}`, ''),
    visibilityChecked,
  };
}
