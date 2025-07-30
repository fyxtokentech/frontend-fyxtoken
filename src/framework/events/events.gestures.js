import { onTouchStart, onTouchMove, onTouchEnd } from "./events.listeners.js";
import { Vector } from "../tools/math/math.vector.js";
import { state, touch } from "./events.base.js";

// Utility to calculate distance between two touch points
function getTouchDistance(e) {
  const [t1, t2] = e.touches;
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

// Zoom gestures
export function onZoom(
  cb,
  { type = "all", component, start = () => {}, end = () => {} } = {}
) {
  let lastDist = null;
  let touchStart = new Vector();

  const thisState = (props = {}) => ({
    lastDist,
    touchStart,
    typeBase: type,
    ...state(),
    ...props,
  });
  onTouchStart((e) => {
    if (e.touches.length != 2) {
      return;
    }
    lastDist = getTouchDistance(e);
    touchStart = touch();
    start(e, thisState());
  }, component);
  onTouchMove((e) => {
    if (e.touches.length != 2 || lastDist == null) {
      return;
    }
    const currentDist = getTouchDistance(e);
    let caseType;
    if (currentDist > lastDist) {
      caseType = "in";
    }
    if (currentDist < lastDist) {
      caseType = "out";
    }
    const cbex = () => {
      cb(e, thisState({ dist: currentDist, type: caseType }));
      lastDist = currentDist;
    };
    switch (type) {
      case "in":
        if (caseType === "in") {
          cbex();
        }
        break;
      case "out":
        if (caseType === "out") {
          cbex();
        }
        break;
      case "all":
      default:
        cbex();
        break;
    }
  }, component);
  onTouchEnd((e) => {
    if (e.touches.length != 2) {
      return;
    }
    lastDist = null;
    touchStart = null;
    end(e, thisState());
  }, component);
}

export function onZoomIn(cb, config = {}) {
  onZoom(cb, { type: "in", ...config });
}

export function onZoomOut(cb, config = {}) {
  onZoom(cb, { type: "out", ...config });
}

// Utility to calculate angle between two touch points
function getTouchAngle(e) {
  const [t1, t2] = e.touches;
  return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
}

// Rotation gestures
export function onRotate(
  cb,
  { type = "all", component, start = () => {}, end = () => {} } = {}
) {
  let lastAngle = null;
  let startAngle = null;
  const thisState = (props) => ({
    lastAngle,
    startAngle,
    typeBase: type,
    ...state(),
    ...props,
  });
  onTouchStart((e) => {
    if (e.touches.length != 2) {
      return;
    }
    lastAngle = getTouchAngle(e);
    startAngle = lastAngle;
    start(e, thisState());
  }, component);
  onTouchMove((e) => {
    if (e.touches.length != 2 || lastAngle == null) {
      return;
    }
    const currentAngle = getTouchAngle(e);
    const diff = currentAngle - lastAngle;
    let caseType;
    if (diff > 0) {
      caseType = "right"; // counter-clockwise
    }
    if (diff < 0) {
      caseType = "left"; // clockwise
    }
    const cbex = () => {
      cb(
        e,
        thisState({
          angle: currentAngle,
          type: caseType,
          diff,
        })
      );
      lastAngle = currentAngle;
    };
    switch (type) {
      case "right":
        if (caseType === "right") {
          cbex();
        }
        break;
      case "left":
        if (caseType === "left") {
          cbex();
        }
        break;
      case "all":
      default:
        cbex();
        break;
    }
  }, component);
  onTouchEnd((e) => {
    if (e.touches.length != 2) {
      return;
    }
    lastAngle = null;
    startAngle = null;
    end(e, thisState());
  }, component);
}

// Specialized rotation listeners
export function onRotateLeft(cb, config = {}) {
  onRotate(cb, { type: "left", ...config });
}

export function onRotateRight(cb, config = {}) {
  onRotate(cb, { type: "right", ...config });
}

// Swipe gestures
export function onSwipe(
  cb,
  {
    type = "all",
    mainDistance = 30,
    secondaryDistance = 15,
    component,
    start = () => 0,
    end = () => 0,
  } = {}
) {
  if (type === "all") {
    secondaryDistance = mainDistance;
  }
  let startPos = null;
  const thisState = (props = {}) => ({
    startPos,
    typeBase: type,
    ...state(),
    ...props,
  });
  onTouchStart((e) => {
    if (e.touches.length !== 1) {
      return;
    }
    const [t] = e.touches;
    startPos = new Vector(t.clientX, t.clientY);
    start(e, thisState());
  }, component);
  onTouchEnd((e) => {
    if (startPos == null) {
      return;
    }
    const [t] = e.changedTouches;
    const endPos = new Vector(t.clientX, t.clientY);
    const dist = endPos.copy().sub(startPos);
    const abs = new Vector(Math.abs(dist.x), Math.abs(dist.y));
    const [main, secondary] = (() => {
      const x = [abs.x, abs.y];
      const y = [abs.y, abs.x];
      switch (type) {
        case "right":
        case "left":
          return x;
        case "up":
        case "down":
          return y;
        default:
          return abs.x > abs.y ? x : y;
      }
    })();
    if (main > mainDistance && secondary < secondaryDistance) {
      startPos = null;
      end(e, thisState());
      return;
    }
    let caseType;
    if (abs.x > abs.y) {
      caseType = dist.x > 0 ? "right" : "left";
    } else {
      caseType = dist.y > 0 ? "down" : "up";
    }
    let success = false;
    if (type === "all" || type === caseType) {
      success = true;
      cb(e, varsState());
    }
    end(e, varsState());
    startPos = null;

    function varsState() {
      return thisState({
        endPos,
        dist,
        type: caseType,
        success,
      });
    }
  }, component);
}

export function onSwipeLeft(cb, config = {}) {
  onSwipe(cb, { type: "left", ...config });
}

export function onSwipeRight(cb, config = {}) {
  onSwipe(cb, { type: "right", ...config });
}

export function onSwipeUp(cb, config = {}) {
  onSwipe(cb, { type: "up", ...config });
}

export function onSwipeDown(cb, config = {}) {
  onSwipe(cb, { type: "down", ...config });
}
