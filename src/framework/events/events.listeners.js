import { MOUSE_LEFT, MOUSE_MIDDLE, MOUSE_RIGHT } from "./events.ids.js";
import { addListenerIn } from "./events.base.js";

export function onDragLeft(cb, component) {
  addListenerIn("mousemove", {
    fn: (e, state) => {
      if (e.button === MOUSE_LEFT) {
        cb(e, state);
      }
    },
    component,
  });
}

export function onMouseMove(cb, component) {
  addListenerIn("mousemove", {
    fn: cb,
    component,
  });
}

export function onMouseDown(cb, component) {
  addListenerIn("mousedown", {
    fn: cb,
    component,
  });
}

export function onMouseUp(cb, component) {
  addListenerIn("mouseup", {
    fn: cb,
    component,
  });
}

export function onMouseOver(cb, component) {
  addListenerIn("mouseover", {
    fn: cb,
    component,
  });
}

export function onMouseOut(cb, component) {
  addListenerIn("mouseout", {
    fn: cb,
    component,
  });
}

export function onMouseEnter(cb, component) {
  addListenerIn("mouseenter", {
    fn: cb,
    component,
  });
}

export function onMouseLeave(cb, component) {
  addListenerIn("mouseleave", {
    fn: cb,
    component,
  });
}

export function onClickLeft(cb, component) {
  addListenerIn("click", {
    fn: (e, state) => {
      if (e.button === MOUSE_LEFT) {
        cb(e, state);
      }
    },
    component,
  });
}

export function onClickMiddle(cb, component) {
  addListenerIn("click", {
    fn: (e, state) => {
      if (e.button === MOUSE_MIDDLE) {
        cb(e, state);
      }
    },
    component,
  });
}

export function onClickRight(cb, component) {
  addListenerIn("click", {
    fn: (e, state) => {
      if (e.button === MOUSE_RIGHT) {
        cb(e, state);
      }
    },
    component,
  });
}

// Additional event listeners
export function onDoubleClick(cb, component) {
  addListenerIn("dblclick", { fn: cb, component });
}

export function onContextMenu(cb, component) {
  addListenerIn("contextmenu", { fn: cb, component });
}

export function onWheel(cb, component) {
  addListenerIn("wheel", { fn: cb, component });
}

export function onDragStart(cb, component) {
  addListenerIn("dragstart", { fn: cb, component });
}

export function onDrag(cb, component) {
  addListenerIn("drag", { fn: cb, component });
}

export function onDragEnd(cb, component) {
  addListenerIn("dragend", { fn: cb, component });
}

export function onTouchStart(cb, component) {
  addListenerIn("touchstart", { fn: cb, component });
}

export function onTouchMove(cb, component) {
  addListenerIn("touchmove", { fn: cb, component });
}

export function onTouchEnd(cb, component) {
  addListenerIn("touchend", { fn: cb, component });
}

// Keyboard events
export function onKeyDown(cb, component) {
  addListenerIn("keydown", { fn: cb, component });
}

export function onKeyUp(cb, component) {
  addListenerIn("keyup", { fn: cb, component });
}

export function onKeyPress(cb, component) {
  addListenerIn("keypress", { fn: cb, component });
}

// Window events
export function onResize(cb, component) {
  addListenerIn("resize", { fn: cb, component });
}

export function onScroll(cb, component) {
  addListenerIn("scroll", { fn: cb, component });
}

export function onBlur(cb, component) {
  addListenerIn("blur", { fn: cb, component });
}

export function onFocus(cb, component) {
  addListenerIn("focus", { fn: cb, component });
}
