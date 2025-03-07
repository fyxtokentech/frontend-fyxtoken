const componentsContext = require.context('../../_web', true, /\.jsx$/);

const componentsMap = componentsContext.keys().reduce((map, filePath) => {
  const componentName = filePath.replace('./', '').replace('.jsx', '');
  map[componentName] = componentsContext(filePath).default;
  return map;
}, {});

export default componentsMap;