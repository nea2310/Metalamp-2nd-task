export default function prepareOptions(options) {
  const {
    isExpandable,
    isRich,
  } = options;

  const elementName = 'checklist';

  return {
    elementName,
    style: isExpandable ? `${elementName}_collapsing` : '',
    tabindexValue: isExpandable ? 0 : -1,
    categoryStyle: isRich ? `${elementName}__category_rich` : '',
  };
}
