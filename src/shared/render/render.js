function render(components, wrapper, selectorName) {
  components.forEach((component) => {
    Object.entries(component).forEach(([key, Value]) => {
      const elements = wrapper.querySelectorAll(`${selectorName}__${key}`);
      elements.forEach((item) => {
        const element = item.querySelector(`.js-${key}`);
        return new Value(element);
      });
    });
  });
}

export default render;
