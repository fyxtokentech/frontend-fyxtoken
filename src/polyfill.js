// Polyfills and environment adjustments
export function init() {
  const context = global.configApp?.context;
  // En producción, desactivar console.log, console.warn y console.error
  if (context === 'prod' || context === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
}
