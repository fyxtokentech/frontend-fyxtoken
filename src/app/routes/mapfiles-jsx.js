const componentsContext = require.context('../../_web', true, /\.[jt]sx$/);

const componentsMap = componentsContext.keys().reduce((map, filePath) => {
  const componentName = filePath.replace('./', '').replace(/\.[jt]sx$/, '');
  map[componentName] = componentsContext(filePath).default;
  return map;
}, {});

export default componentsMap;