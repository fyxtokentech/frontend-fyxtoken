import EventDriver from "@app/events-driver";

import { Component } from "react";
import { isDark } from "@jeff-aporta/theme-manager";

import { zIndex } from "@theme/constants";
import fluidCSS from "@jeff-aporta/fluidcss";

class CursorLight extends Component {
  static ready = false;

  constructor(props) {
    super(props);
    const fn = CursorLight.interactivity;
    EventDriver.addIn(
      ["keyup", "keydown", "mousemove", "mousedown", "mouseup", "resize"],
      { fn }
    );
  }

  componentDidMount() {
    CursorLight.ready = true;
  }

  render() {
    if (!isDark()) {
      return <></>;
    }

    return (
      <>
        <CursorEffectLight
          colors={["blue", "transparent 70%"]}
          mixBlendMode="soft-light"
          opacity="0.3"
          zIndex={zIndex.mouseFxBackall}
        />
        <CursorEffectLight
          colors={["magenta", "transparent 50%"]}
          mixBlendMode="screen"
          opacity="0.07"
          zIndex={zIndex.mouseFxOverall}
        />
      </>
    );

    function CursorEffectLight({ children, colors, ...styles }) {
      return (
        <div
          className={fluidCSS()
            .withTouchscreen({
              display: "none",
            })
            .end([
              "transform-centerized",
              "cursor-effect",
              "minside-win",
              "no-select",
              "p-fixed",
            ])}
          data-opacity={styles.opacity ?? 1}
          style={{
            transition: "opacity 0.2s",
            background: `radial-gradient(
                  circle at center, 
                  ${colors.join(", ")}
                )`,
            ...styles,
          }}
        />
      );
    }
  }

  static interactivity() {
    if (!CursorLight.ready) {
      return;
    }
    const { isTouchDevice, mouseLeftPressed } = EventDriver;
    const { Control } = EventDriver.isKeyPressed;
    CursorLight.allCursorEffects.forEach((cursorEffect) => {
      cursorEffect.style.opacity = (() => {
        if (isTouchDevice || mouseLeftPressed || Control) {
          return "0";
        } else {
          return cursorEffect.dataset.opacity;
        }
      })();
    });
    setTimeout(CursorLight.updateLightCursor);
  }

  static get allCursorEffects() {
    return document.querySelectorAll(".cursor-effect") ?? [];
  }

  static updateLightCursor() {
    // Extraer propiedades necesarias de EventDriver
    const { mouseX, mouseY } = EventDriver;

    CursorLight.allCursorEffects.forEach((element) => {
      element.style.left = `${mouseX}px`;
      element.style.top = `${mouseY}px`;
    });
  }
}

export default CursorLight;
