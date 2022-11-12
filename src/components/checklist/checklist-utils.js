export default function prepareOptions(options) {
  const {
    isExpandable,
    isRich,
    isCollapsed,
  } = options;

  const elementName = 'checklist';
  let style = isExpandable ? `${elementName}_collapsing` : '';
  const isCollapsedModifier = isCollapsed ? '' : `${elementName}_expanded`;

  style += ` ${isCollapsedModifier}`;

  return {
    elementName,
    style,
    tabindexValue: isExpandable ? 0 : -1,
    categoryStyle: isRich ? `${elementName}__category_rich` : '',
  };
}
