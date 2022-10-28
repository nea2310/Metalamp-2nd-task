function getElement(selector, wrapper, rootSelector) {
  return wrapper.querySelector(`.${rootSelector}__${selector}`);
}

export default getElement;
