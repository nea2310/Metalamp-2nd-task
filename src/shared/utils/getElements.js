function getElements(selectors, wrapper, rootSelector) {
  let string = '';
  selectors.forEach((item) => {
    string += `.js-${rootSelector}__${item},`;
  });
  string = string.substring(0, string.length - 1);
  return wrapper.querySelectorAll(string);
}

export default getElements;
