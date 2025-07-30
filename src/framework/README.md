## API de mapeo

- `getURLMapAPI()`: retorna el mapa de endpoints configurados.
- `setURLMapAPI(map)`: asigna nuevos endpoints al mapa.
- `getMessageError(err, defaultErr)`: extrae el mensaje de error.
- `reEnvolve(mainF, secondF)`: combina dos callbacks en uno.
- `failureDefault(...args)`: manejo predeterminado de errores.
- `buildUrlFromService(buildEndpoint, service)`: genera la URL completa de un servicio.
- `unpackTable(table)`: convierte una matriz de arrays en un array de objetos.

## HTTP genérico

- `AUTO_PARAMS(props)`: añade valores automáticos a parámetros.
- `PROCESS_REQUEST_HTTP(data)`: normaliza la estructura de respuesta.
- `processResponseReceived(opts)`: invoca callbacks de éxito o fallo.
- `MAKE_GET(opts)`: realiza GET y normaliza la respuesta.
- `MAKE_POST(opts)`: realiza POST y normaliza la respuesta.
- `MAKE_PATCH(opts)`: realiza PATCH y normaliza la respuesta.
- `MAKE_PUT(opts)`: realiza PUT y normaliza la respuesta.

## Estilos fluidos

- `isSmall()`: detecta vista pequeña.
- `isMedium()`: detecta vista mediana.
- `isLarge()`: detecta vista grande.
- `JS2CSS`: transforma objetos JS en reglas CSS.
- `fluidCSS()`: crea un nuevo contexto de estilos.

**Ejemplos de uso de `fluidCSS()`:**

```jsx
// Ejemplo básico con ltX para anchura mínima
<div className={fluidCSS()
  .ltX("small", { width: "100%" })
  .end()}>
  {/* contenido */}
</div>

// Ejemplo con gtY usando alias de tamaño y variante Y
<div className={fluidCSS()
  .gtY("medium", { height: "50px" })
  .end()}>
  {/* contenido */}
</div>

// Ejemplo de interpolación lerpX con clase adicional
<div className={fluidCSS()
  .lerpX("responsive-min", { fontSize: [15, 20] })
  .end("text-fluid")}>
  {/* contenido */}
</div>

// Ejemplo de btwX para aplicar estilos dentro de un rango
<div className={fluidCSS()
  .btwX([400, 600], { padding: "8px" })
  .end()}>
  {/* contenido */}
</div>

// Ejemplo mezclando end() con className existente
<div {...props} className={fluidCSS()
  .ltX("medium", { width: "100%" })
  .end(props.className ?? "")}>
  {/* contenido */}
</div>
```

## Temas y UI

- `getThemeName()`: obtiene el nombre del tema activo.
- `updateThemeName(name)`: cambia el tema activo.
- `isRegistered(name)`: comprueba si un tema existe.
- `showPromptDialog(props)`: abre un diálogo modal y devuelve una promesa.
- `PromptDialog`: componente de diálogo configurable.
- `getUseViewId()`: lee el flag de visualización de ID.
- `configUseViewId(val)`: modifica el flag de visualización de ID.
- `Notifier`: muestra notificaciones tipo snackbar.
- `ToolsCustomizeInFooter`: componente auxiliar de opciones en el footer.

## Eventos

- `touch()`, `touchX()`, `touchY()`: posición táctil actual.
- `prevTouch()`, `prevTouchX()`, `prevTouchY()`: posición táctil anterior.
- `touchStart()`, `touchStartX()`, `touchStartY()`: inicio de toque.
- `touchDelta()`, `touchDeltaX()`, `touchDeltaY()`: delta de toque.
- `mouse()`, `mouseX()`, `mouseY()`: posición del cursor.
- `prevMouse()`, `prevMouseX()`, `prevMouseY()`: posición previa del cursor.
- `percentMouse()`, `percentMouseX()`, `percentMouseY()`: posición normalizada 0–1.
- `percentMouseCenter()`, `percentMouseCenterX()`, `percentMouseCenterY()`: posición normalizada -1–1.
- `moved()`, `movedX()`, `movedY()`: delta de movimiento del cursor.
- `mousePressed()`: estado de botones del mouse.
- `mouseStartLeft()`, `mouseDeltaLeft()`: vector de inicio y delta de clic izquierdo.
- `mouseLeftPressed()`, `mouseMiddlePressed()`, `mouseRightPressed()`: estado de cada botón.
- `isKeyPressed(key)`: verifica si una tecla está presionada.
- `key()`, `keyCode()`, `isAnyKeyDown()`: estado de teclado.
- `controlPressed()`, `shiftPressed()`, `altPressed()`: estado de teclas modificadoras.
- `windowWidth()`, `windowHeight()`, `bodyWidth()`, `bodyHeight()`, `windowCX()`, `windowCY()`: dimensiones de ventana y documento.
- `scrollY()`: posición de scroll vertical.

## Utilidades

- `clamp(value, min, max)`: restringe un valor entre un mínimo y un máximo.
- `map(value, inMin, inMax, outMin, outMax)`: reescala un valor.
- `Vector`: clase para vectores 2D.
- `formatDate(date, fmt)`: formatea una fecha.
- `parseTime(str)`: convierte cadena en objeto de tiempo.
- funciones de tiempo y scripts auxiliares.
- hooks y helpers de React.

## Exportaciones adicionales

## Descripción de exportaciones adicionales

**Constantes de teclado**

- `ALT`, `CONTROL`, `SHIFT`, `ESCAPE`, `ENTER`, `TAB`, `SPACE`, `BACKSPACE`, `DELETE`, `ARROW_UP`, `ARROW_DOWN`, `ARROW_LEFT`, `ARROW_RIGHT`, `PAGE_UP`, `PAGE_DOWN`, `HOME`, `END`, `INSERT`, `PAUSE`, `SCROLL_LOCK`, `PRINT_SCREEN`, `CONTEXT_MENU`, `SEMICOLON`, `COMMA`, `PERIOD`, `SLASH`, `BACKSLASH`, `BRACKET_LEFT`, `BRACKET_RIGHT`, `QUOTE`, `EQUAL`, `GRAVE`, `NUM_LOCK`, `NUMPAD_0-9`, `NUMPAD_ADD`, `NUMPAD_SUBTRACT`, `NUMPAD_MULTIPLY`, `NUMPAD_DIVIDE`, `NUMPAD_DECIMAL`, `NUMPAD_SEPARATOR`:
  claves y constantes de códigos para teclas físicas.

**Componentes de interfaz**

- `Android12Switch`, `AntSwitch`, `IOSSwitch`, `LuminanceThemeSwitch`: distintos switches con temas y estilos específicos.
- `AppThemeProvider`: proveedor de contexto para gestión y aplicación de temas.
- `DialogSimple`: componente de diálogo modal simple.
- `CaptionWrapper`, `DivM`, `DynTable`, `TooltipGhost`, `TitleInfo`: componentes auxiliares para contenedores, tablas y tooltips.
- `IconButtonWithTooltip`, `InputGender`, `SelectFast`, `ImageLocal`: componentes de entrada y botones con funcionalidades añadidas.
- `Color`, `CursorLight`, `PaperDesign`, `PaperF`, `PaperLayer`, `PaperP`: componentes visuales para paletas y fondos.
- `Notifier`: sistema de notificaciones tipo snackbar.
- `PromptDialog`: diálogo configurable con múltiples tipos de input.
- `RoutingManagement`: API para gestión de rutas y navegación.
- `ToolsCustomizeInFooter`: utilidades UI para personalizar pie de página.

**Gestión de temas y estilos**

- `applyTheme`, `applyDefaultBackground`, `applyPortalBackground`: funciones para aplicar estilos y temas globales.
- `assignMapManagement`, `getCreateThemeName`, `addCreateThemeName`, `initializeThemeColors`, `initializeThemesPolychroma`: helpers para registro y configuración de temas.
- `burnBGFluid`, `circleGradient`, `linearGradient`, `radialGradient`: generadores de fondos y degradados.
- `setThemeName`, `getThemeName`, `addThemeChangeListener`, `removeThemeChangeListener`, `triggerThemeChange`: gestión dinámica del tema activo.

**Variables y constantes de configuración**

- `IS_GITHUB`, `IS_LOCAL`: flags de entorno.
- `driverParams`, `defaultUseViewId`, `initStorageUseViewId`, `getUseViewIdStorage`: configuración y persistencia de valores.

**Eventos y listeners adicionales**

- `onClickLeft`, `onClickMiddle`, `onClickRight`, `onDoubleClick`, `onContextMenu`, `onDrag`, `onWheel`, `onSwipe*`, `onTouch*`, `onZoom*`, `onResize`, `onScroll`: métodos para suscripción a eventos del DOM.
- `addListenerIn`, `removeListenerOf`, `removeAllListeners`, `searchListenerIn`: gestión de listeners genéricos.
- `notifyRouterListeners`, `addRouterListener`, `removeRouterListener`: gestión de listeners de rutas.

**Otras utilidades**

- `buildHref(path)`: genera rutas internas amigables.
- `getQueryPath(url)`: extrae la parte de ruta de una URL con parámetros.
- `getComponentsQuery(params)`: filtra y prepara parámetros para componentes.
- `getRoutesAvailable()`: devuelve el listado de rutas registradas.
- `clamp(value, min, max)`: limita un número dentro de un rango.
- `map(value, inMin, inMax, outMin, outMax)`: mapea un valor de un rango a otro.
- `Vector(x, y)`: clase para operaciones vectoriales en 2D.
- `JS2CSS(styleObj)`: convierte objetos JS en reglas CSS.
- `lerpX/lerpY`, `btwX/btwY`, `ltX/ltY`, `gtX/gtY`: operadores para estilos fluidos responsivos.
- `firstUppercase(str)`: convierte la primera letra de una cadena en mayúscula.
- `day(date)`, `hour(date)`, `minute(date)`, `month(date)`, `year(date)`: extraen componentes de fecha.
- `millis()`: retorna timestamp actual en milisegundos.
- `noise(value)`, `noiseDetail(value, detail)`, `noiseSeed(seed)`: generan ruido procedural.
- `state()`: accede o crea un estado global reactivo.
- `modelFormat(data)`: formatea datos según un esquema.
- `scripts`: colección de utilidades de scripting.
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  AUTO_PARAMS,
  A_LOWER,
  A_UPPER,
  Android12Switch,
  AntSwitch,
  AppThemeProvider,
  BACKSLASH,
  BACKSPACE,
  BRACKET_LEFT,
  BRACKET_RIGHT,
  B_LOWER,
  B_UPPER,
  CAPS_LOCK,
  COMMA,
  CONTEXT_MENU,
  CONTROL,
  C_LOWER,
  C_UPPER,
  CaptionWrapper,
  Color,
  CursorLight,
  DASH,
  DELETE,
  DIGIT_0,
  DIGIT_1,
  DIGIT_2,
  DIGIT_3,
  DIGIT_4,
  DIGIT_5,
  DIGIT_6,
  DIGIT_7,
  DIGIT_8,
  DIGIT_9,
  D_LOWER,
  D_UPPER,
  Design,
  DialogSimple,
  DivM,
  DynTable,
  END,
  ENTER,
  EQUAL,
  ESCAPE,
  E_LOWER,
  E_UPPER,
  F1,
  F10,
  F11,
  F12,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  F_LOWER,
  F_UPPER,
  GRAVE,
  G_LOWER,
  G_UPPER,
  HOME,
  H_LOWER,
  H_UPPER,
  Hm,
  INSERT,
  IOSSwitch,
  IS_GITHUB,
  IS_LOCAL,
  I_LOWER,
  I_UPPER,
  IconButtonWithTooltip,
  ImageLocal,
  Info,
  InputGender,
  JS2CSS,
  J_LOWER,
  J_UPPER,
  KEY_A,
  KEY_B,
  KEY_C,
  KEY_D,
  KEY_E,
  KEY_F,
  KEY_G,
  KEY_H,
  KEY_I,
  KEY_J,
  KEY_K,
  KEY_L,
  KEY_M,
  KEY_N,
  KEY_O,
  KEY_P,
  KEY_Q,
  KEY_R,
  KEY_S,
  KEY_T,
  KEY_U,
  KEY_V,
  KEY_W,
  KEY_X,
  KEY_Y,
  KEY_Z,
  K_LOWER,
  K_UPPER,
  L_LOWER,
  L_UPPER,
  Layer,
  LuminanceThemeSwitch,
  MAKE_GET,
  MAKE_PATCH,
  MAKE_POST,
  MAKE_PUT,
  META_LEFT,
  META_RIGHT,
  MOUSE_LEFT,
  MOUSE_MIDDLE,
  MOUSE_RIGHT,
  M_LOWER,
  M_UPPER,
  NUMPAD_0,
  NUMPAD_1,
  NUMPAD_2,
  NUMPAD_3,
  NUMPAD_4,
  NUMPAD_5,
  NUMPAD_6,
  NUMPAD_7,
  NUMPAD_8,
  NUMPAD_9,
  NUMPAD_ADD,
  NUMPAD_DECIMAL,
  NUMPAD_DIVIDE,
  NUMPAD_MULTIPLY,
  NUMPAD_SEPARATOR,
  NUMPAD_SUBTRACT,
  NUM_LOCK,
  N_LOWER,
  N_UPPER,
  Notifier,
  O_LOWER,
  O_UPPER,
  PAGE_DOWN,
  PAGE_UP,
  PAUSE,
  PERIOD,
  PRINT_SCREEN,
  P_LOWER,
  P_UPPER,
  PaintBG,
  PaletteBaseMonochrome,
  PaletteGeneral,
  PaletteMonochrome,
  Pandachrome,
  PaperDesign,
  PaperF,
  PaperLayer,
  PaperP,
  Polychroma,
  PromptDialog,
  QUOTE,
  Q_LOWER,
  Q_UPPER,
  R_LOWER,
  R_UPPER,
  RoutingManagement,
  SCROLL_LOCK,
  SEMICOLON,
  SHIFT,
  SLASH,
  SPACE,
  S_LOWER,
  S_UPPER,
  SelectFast,
  TAB,
  T_LOWER,
  T_UPPER,
  TitleInfo,
  ToolsCustomizeInFooter,
  TooltipGhost,
  U_LOWER,
  U_UPPER,
  UseViewId,
  V_LOWER,
  V_UPPER,
  Vector,
  W_LOWER,
  W_UPPER,
  X_LOWER,
  X_UPPER,
  Y_LOWER,
  Y_UPPER,
  Z_LOWER,
  Z_UPPER,
  addCreateThemeName,
  addExcludeThemeName,
  addListenerIn,
  addRouterListener,
  addThemeChangeListener,
  addThemeSwitchListener,
  altPressed,
  applyDefaultBackground,
  applyPortalBackground,
  applyTheme,
  assignMapManagement,
  bodyHeight,
  bodyWidth,
  buildHref,
  buildUrlFromService,
  burnBGFluid,
  childs,
  circleGradient,
  clamp,
  colorFilterDiscriminator,
  configUseViewId,
  controlComponents,
  controlPressed,
  customizeComponents,
  customizeScrollbar,
  day,
  defaultUseViewId,
  driverParams,
  events,
  exclude,
  failureDefault,
  fdhue,
  firstUppercase,
  fluidCSS,
  genAllColumns,
  genInputsGender,
  genSelectFast,
  getAdjacentPrimaryColor,
  getAllColors,
  getAllPaths,
  getAllThemesRegistered,
  getAssignedPath,
  getColorBGTheme,
  getColorBackground,
  getColorPaperTheme,
  getComplement,
  getComponentsQuery,
  getContrast,
  getContrastPaper,
  getCreateThemeName,
  getCustomRoutes,
  getExcludeThemeName,
  getFilePath,
  getFirstLevelFolder,
  getLightFilter,
  getMUIDefaultValues,
  getMessageError,
  getPaletteConfig,
  getPaletteLoader,
  getPrimaryColor,
  getPrimaryColors,
  getQueryPath,
  getRoutesAvailable,
  getSecondaryColors,
  getSelectedPalette,
  getSettingsView,
  getTheme,
  getThemeLuminance,
  getThemeName,
  getTriadeColors,
  getURLMapAPI,
  getUseViewId,
  getUseViewIdStorage,
  holeCircleGradient,
  hour,
  href,
  hrefManagement,
  initStorageUseViewId,
  initThemeCamaleon,
  initThemeName,
  initializeThemeColors,
  initializeThemesPolychroma,
  isAnyKeyDown,
  isBGDark,
  isDark,
  isKeyPressed,
  isLarge,
  isMedium,
  isMobile,
  isPanda,
  isReadyThemeChange,
  isRegistered,
  isSmall,
  isThemed,
  key,
  keyCode,
  lerp,
  linearGradient,
  map,
  millis,
  minute,
  modelsFormat,
  month,
  mouse,
  mouseDeltaLeft,
  mouseDeltaLeftX,
  mouseDeltaLeftY,
  mouseLeftPressed,
  mouseMiddlePressed,
  mousePressed,
  mouseRightPressed,
  mouseStartLeft,
  mouseStartLeftX,
  mouseStartLeftY,
  mouseX,
  mouseY,
  moved,
  movedX,
  movedY,
  muiColors,
  newBackground,
  noise,
  noiseDetail,
  noiseSeed,
  notifyRouterListeners,
  onClickLeft,
  onClickMiddle,
  onClickRight,
  onContextMenu,
  onDoubleClick,
  onDrag,
  onDragEnd,
  onDragLeft,
  onDragStart,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onResize,
  onRotate,
  onRotateLeft,
  onRotateRight,
  onScroll,
  onSwipe,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  onWheel,
  onZoom,
  onZoomIn,
  onZoomOut,
  percentMouse,
  percentMouseCenter,
  percentMouseCenterX,
  percentMouseCenterY,
  percentMouseX,
  percentMouseY,
  percentScrollX,
  percentScrollY,
  prevMouse,
  prevMouseX,
  prevMouseY,
  prevTouch,
  prevTouchX,
  prevTouchY,
  processSettingsView,
  radialGradient,
  reEnvolve,
  readyThemeManager,
  registerColors,
  registerThemes_PaletteGeneral,
  removeAllListeners,
  removeListenerOf,
  removeRouterListener,
  removeThemeChangeListener,
  removeThemeSwitchListener,
  ringGradient,
  scrollX,
  scrollY,
  scrollbarColors,
  searchListenerIn,
  second,
  setSettingsView,
  setThemeLuminance,
  setThemeName,
  setURLMapAPI,
  shiftPressed,
  showError,
  showInfo,
  showJSX,
  showPromise,
  showPromptDialog,
  showSuccess,
  showWarning,
  solid,
  state,
  themeColors,
  themeSwitch_listener,
  toViewportPercent,
  touch,
  touchDelta,
  touchDeltaX,
  touchDeltaY,
  touchDetected,
  touchStart,
  touchStartX,
  touchStartY,
  touchX,
  touchY,
  transformColor,
  triggerThemeChange,
  typographyTheme,
  unpackTable,
  url,
  urlMapApi,
  windowCX,
  windowCY,
  windowHeight,
  windowWidth,
  year,
  zIndex
  };

```
