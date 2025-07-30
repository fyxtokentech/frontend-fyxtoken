import { JS2CSS } from "../fluidCSS/JS2CSS/index.js";
import { clamp, map } from "../tools/math/math.js";
import { Vector } from "../tools/math/math.vector.js";
import {
  CONTROL,
  SHIFT,
  ALT,
  MOUSE_LEFT,
  MOUSE_MIDDLE,
  MOUSE_RIGHT,
} from "./events.ids.js";
import {
  onMouseUp,
  onMouseMove,
  onKeyDown,
  onKeyUp,
  onTouchStart,
  onTouchMove,
  onResize,
  onMouseDown,
} from "./events.listeners.js";

// Touch vectors
let touchVec = new Vector();
let prevTouchVec = new Vector();
export const touch = () => touchVec.copy();
export const touchX = () => parseInt(touchVec.x);
export const touchY = () => parseInt(touchVec.y);
export const prevTouch = () => prevTouchVec.copy();
export const prevTouchX = () => parseInt(prevTouchVec.x);
export const prevTouchY = () => parseInt(prevTouchVec.y);

// Touch start position
let touchStartVec = new Vector();
export const touchStart = () => touchStartVec.copy();
export const touchStartX = () => parseInt(touchStartVec.x);
export const touchStartY = () => parseInt(touchStartVec.y);

// Touch delta vector (current - start)
let touchDeltaVec = new Vector();
export const touchDelta = () => touchDeltaVec.copy();
export const touchDeltaX = () => parseInt(touchDeltaVec.x);
export const touchDeltaY = () => parseInt(touchDeltaVec.y);

// Mouse vectors
let mouseVec = new Vector();
let prevMouseVec = new Vector();
export const mouse = () => mouseVec.copy();
export const mouseX = () => parseInt(mouseVec.x);
export const mouseY = () => parseInt(mouseVec.y);
export const prevMouse = () => prevMouseVec.copy();
export const prevMouseX = () => parseInt(prevMouseVec.x);
export const prevMouseY = () => parseInt(prevMouseVec.y);

// Percent movement vector (0-1)
let percentMouseVec = new Vector();
export const percentMouse = () => percentMouseVec.copy();
export const percentMouseX = () => +percentMouseVec.x.toFixed(2);
export const percentMouseY = () => +percentMouseVec.y.toFixed(2);

// Centered percent vector (-1 to 1)
let percentMouseCenterVec = new Vector();
export const percentMouseCenter = () => percentMouseCenterVec.copy();
export const percentMouseCenterX = () => +percentMouseCenterVec.x.toFixed(2);
export const percentMouseCenterY = () => +percentMouseCenterVec.y.toFixed(2);

// Movement delta vector
let movedVec = new Vector();
export const moved = () => movedVec.copy();
export const movedX = () => parseInt(movedVec.x);
export const movedY = () => parseInt(movedVec.y);

// Left click start and delta vectors
let mouseStartLeftVec = new Vector(NaN, NaN);
export const mouseStartLeft = () => mouseStartLeftVec.copy();
export const mouseStartLeftX = () => parseInt(mouseStartLeftVec.x);
export const mouseStartLeftY = () => parseInt(mouseStartLeftVec.y);
let mouseDeltaLeftVec = new Vector(NaN, NaN);
export const mouseDeltaLeft = () => mouseDeltaLeftVec.copy();
export const mouseDeltaLeftX = () => parseInt(mouseDeltaLeftVec.x);
export const mouseDeltaLeftY = () => parseInt(mouseDeltaLeftVec.y);

let _mousePressed = [];
export const mousePressed = () => _mousePressed;
let _isKeyPressed = {};
export const isKeyPressed = (key) => (key ? _isKeyPressed[key] : _isKeyPressed);
let _controlPressed = false;
export const controlPressed = () => _controlPressed;
let _shiftPressed = false;
export const shiftPressed = () => _shiftPressed;
let _altPressed = false;
export const altPressed = () => _altPressed;
let _key = "";
export const key = () => _key;
let _keyCode = null;
export const keyCode = () => _keyCode;
let _isAnyKeyDown = false;
export const isAnyKeyDown = () => _isAnyKeyDown;
let _touchDetected = false;
export const touchDetected = () => _touchDetected;

export const windowWidth = () => window.innerWidth;
export const windowHeight = () => window.innerHeight;
export const bodyWidth = () => document.body.clientWidth;
export const bodyHeight = () => document.body.clientHeight;
export const windowCX = () => window.innerWidth / 2;
export const windowCY = () => window.innerHeight / 2;

export const scrollY = () =>
  window.scrollY ||
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

export const scrollX = () =>
  window.scrollX ||
  window.pageXOffset ||
  document.documentElement.scrollLeft ||
  document.body.scrollLeft ||
  0;

export const percentScrollY = () => {
  const valor = scrollY() / (bodyHeight() - windowHeight());
  return clamp(valor, 0, 1);
};
export const percentScrollX = () => {
  const valor = scrollX() / (bodyWidth() - windowWidth());
  return clamp(valor, 0, 1);
};

export const events = {};

const delay_updateCSS = 1000 / 30;
let start_updateCSS = 0;

export function state() {
  const state = {
    mouse,
    mouseX,
    mouseY,
    mousePressed,
    mouseLeftPressed,
    mouseMiddlePressed,
    mouseRightPressed,
    isKeyPressed,
    controlPressed,
    shiftPressed,
    altPressed,
    key,
    keyCode,
    isAnyKeyDown,
    touch,
    touchX,
    touchY,
    touchDetected,
    windowWidth,
    windowHeight,
    bodyWidth,
    bodyHeight,
    windowCX,
    windowCY,
  };
  return Object.entries(state).reduce((acc, [key, value]) => {
    acc[key] = value();
    return acc;
  }, {});
}

function updateCSS() {
  if (Date.now() - start_updateCSS < delay_updateCSS) {
    return;
  }
  start_updateCSS = Date.now();
  JS2CSS.insertStyle({
    id: "theme-manager-events",
    clasesKebab: false,
    ":root": {
      ...genVar("mouseX", mouseX()),
      ...genVar("mouseY", mouseY()),
      ...genVar("scrollX", scrollX()),
      ...genVar("scrollY", scrollY()),
      ...genVar("windowWidth", windowWidth()),
      ...genVar("windowHeight", windowHeight()),
      ...genVar("percentMouseX", percentMouseX(), false),
      ...genVar("percentMouseY", percentMouseY(), false),
      ...genVar("percentMouseCenterX", percentMouseCenterX(), false),
      ...genVar("percentMouseCenterY", percentMouseCenterY(), false),
      ...genVar("mouseLeftPressed", +!!mouseLeftPressed(), false),
      ...genVar("percentScrollY", percentScrollY(), false),
      ...genVar("percentScrollX", percentScrollX(), false),
    },
  });

  function genVar(name, value, px = true) {
    const r = {};
    if (px) {
      r[`--${name}`] = `${parseInt(value)}px`;
      r[`--n-${name}`] = `${parseInt(value)}`;
    } else {
      r[`--${name}`] = `${value}`;
    }
    return r;
  }
}

export function mouseLeftPressed() {
  return _mousePressed[MOUSE_LEFT];
}

export function mouseMiddlePressed() {
  return _mousePressed[MOUSE_MIDDLE];
}

export function mouseRightPressed() {
  return _mousePressed[MOUSE_RIGHT];
}

function toTrigger(nameEvent, listener) {
  if (typeof listener === "function") {
    const arr = events[`${nameEvent}_listeners`];
    listener = {
      index: arr ? arr.length : 0,
      trigger: listener,
    };
  }
  return listener;
}

export function addListenerIn(namesEvent, { fn, index, component }) {
  if (typeof namesEvent == "string") {
    namesEvent = [namesEvent];
  }
  if (!component) {
    component = window;
  }
  namesEvent.forEach((nameEvent) => {
    if (events[`${nameEvent}_listeners`] === undefined) {
      events[`${nameEvent}_listeners`] = [];
      component.addEventListener(nameEvent, (event) => {
        events[`${nameEvent}_listeners`].forEach((listener) => {
          listener.trigger(event, state());
        });
      });
    }
    const array = events[`${nameEvent}_listeners`];
    if (index != null && fn != null) {
      array.splice(index, 0, toTrigger(nameEvent, fn));
    } else if (fn != null) {
      array.push(toTrigger(nameEvent, fn));
    }
  });
}

export function searchListenerIn(nameEvent, { fn, index }) {
  const array = events[`${nameEvent}_listeners`];
  if (index != null) {
    return array[index];
  } else if (fn != null) {
    return array.find((l) => l.trigger === fn);
  }
}

export function removeListenerOf(nameEvent, { fn, index }) {
  const array = events[`${nameEvent}_listeners`];
  if (index != null) {
    array.splice(index, 1);
  } else if (fn != null) {
    events[`${nameEvent}_listeners`] = array.filter((l) => l.trigger !== fn);
  }
}

export function removeAllListeners() {
  for (const arr in events) {
    if (arr.endsWith("_listeners")) {
      events[arr] = [];
    }
  }
}

function updateSpecialKeys(e, state) {
  Object.entries({
    [CONTROL]: () => {
      _controlPressed = state;
    },
    [SHIFT]: () => {
      _shiftPressed = state;
    },
    [ALT]: () => {
      _altPressed = state;
    },
  }).forEach(([key, value]) => {
    if (e.keyCode === key) {
      value();
    }
  });
}

onMouseUp((e) => {
  _mousePressed[e.button] = false;
  if (e.button === MOUSE_LEFT) {
    mouseStartLeftVec.set(NaN, NaN);
    mouseDeltaLeftVec.set(NaN, NaN);
  }
  updateCSS();
});

onMouseDown((e) => {
  _mousePressed[e.button] = true;
  if (e.button === MOUSE_LEFT) {
    mouseStartLeftVec = mouseVec.copy();
    mouseDeltaLeftVec = new Vector(0, 0);
  }
  updateCSS();
});

onMouseMove((e) => {
  // update mouse vectors
  prevMouseVec = mouseVec.copy();
  mouseVec.set(e.clientX, e.clientY);
  // update left-click delta
  mouseDeltaLeftVec = mouseVec.copy().sub(mouseStartLeftVec);
  movedVec = mouseVec.copy().sub(prevMouseVec);
  const pmx = map(mouseVec.x, 0, window.innerWidth, 0, 1);
  const pmy = map(mouseVec.y, 0, window.innerHeight, 0, 1);
  percentMouseVec.set(pmx, pmy);
  percentMouseCenterVec.set(map(pmx, 0, 1, -1, 1), map(pmy, 0, 1, -1, 1));
  updateCSS();
}, document);

onKeyDown((e) => {
  _isKeyPressed[e.key] = true;
  _key = e.key;
  _keyCode = e.keyCode;
  _isAnyKeyDown = true;
  updateSpecialKeys(e, true);
});

onKeyUp((e) => {
  _isKeyPressed[e.key] = false;
  _isAnyKeyDown = Object.values(_isKeyPressed).some((v) => v);
  updateSpecialKeys(e, false);
});

onTouchStart((e) => {
  touchStartVec.set(e.touches[0].clientX, e.touches[0].clientY);
  _touchDetected = true;
});

onTouchMove((e) => {
  prevTouchVec = touchVec.copy();
  touchVec.set(e.touches[0].clientX, e.touches[0].clientY);
  // calculate delta from start
  touchDeltaVec = touchVec.copy().sub(touchStartVec);
  updateCSS();
});

onResize(() => {
  _touchDetected = false;
  updateCSS();
});
