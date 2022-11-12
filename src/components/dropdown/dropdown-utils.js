import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const {
    width,
    isCollapsed,
  } = options;

  const validWidths = ['wide', 'narrow'];
  const elementName = 'dropdown';

  const widthChecked = getValidValue(validWidths, width, 'wide');

  return {
    elementName,
    inputWidth: `_width_${widthChecked}`,
    minus: '-',
    plus: '+',
    inputModifier: isCollapsed ? ` ${elementName}__input_collapsed` : ` ${elementName}__input_expanded`,
    listWrapperModifier: isCollapsed ? ` ${elementName}__list-wrapper_hidden` : '',
    inputWrapperModifier: isCollapsed ? '' : ` ${elementName}__input-wrapper_expanded`,
  };
}
