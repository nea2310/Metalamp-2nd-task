const componentsPaths = require.context('../../components/', true, /.*\.js$/).keys();
const componentsNamesFiltered = componentsPaths.filter((component) => component.match(/^\.\/([\w-]*)\/([A-Z])/));
const componentsNames = componentsNamesFiltered.map((componentName) => {
  const result = componentName.match(/^\.\/([\w-]*)\/([\w]*)/);
  return {
    path: `${result[1]}/${result[2]}`, componentSelector: result[1],
  };
});

function render(page, pageSelector) {
  componentsNames.forEach((componentName) => {
    const { componentSelector, path } = componentName;
    const wrappers = page.querySelectorAll(`${pageSelector}__${componentSelector}`);

    if (wrappers.length) {
      import(`../../components/${path}.js`)
        .then((object) => {
          wrappers.forEach((wrapper) => {
            const component = wrapper.querySelector(`.js-${componentSelector}`);

            if (component) {
              const ClassObject = object.default;
              return new ClassObject(component);
            }
            return null;
          });
        })
        .catch(() => null);
    }
  });
}

export default render;
