import { Component } from "react";
import { JS2CSS } from "../../../fluidCSS/JS2CSS/index.js";
import { millis } from "../../../tools/time.js";
import { driverParams } from "../../router/params.js";

let intervalAnimateCSS;
let frameRateAnimateCSS = 30;

burnTimeCSS();

export function startAnimateCSSTime(frameRate = 30) {
  if (intervalAnimateCSS) {
    return;
  }
  frameRateAnimateCSS = frameRate;
  intervalAnimateCSS = setInterval(burnTimeCSS, 1000 / frameRateAnimateCSS);
}

export function isAnimateCSSInPause() {
  return driverParams.get("pauseAnimateCSS")[0] == "1";
}

export function pauseAnimateCSSTime() {
  driverParams.set("pauseAnimateCSS", "1");
}

export function resumeAnimateCSSTime() {
  driverParams.set("pauseAnimateCSS", "0");
}

export function setFrameRateAnimateCSS(frameRate) {
  frameRateAnimateCSS = frameRate;
}

function burnTimeCSS() {
  if (isAnimateCSSInPause()) {
    return;
  }
  JS2CSS.insertStyle({
    id: "burn-time",
    infer: false,
    ":root": {
      "--burn-time": millis() / 1000,
    },
  });
}

const components_animate = [];

let frameRateAnimateComponents = 20;
let timeSteepRateAnimateComponents = 1000 / frameRateAnimateComponents;

setTimeout(drawComponentsAnimate, timeSteepRateAnimateComponents);

export function setFrameRateAnimateComponents(frameRate) {
  frameRateAnimateComponents = frameRate;
  timeSteepRateAnimateComponents = 1000 / frameRate;
}

export function pauseAnimateComponentsTime() {
  driverParams.set("pauseAnimateComponents", "1");
}

export function resumeAnimateComponentsTime() {
  driverParams.set("pauseAnimateComponents", "0");
}

export function isThereAnimateComponents() {
  return components_animate.length > 0;
}

export function isAnimateComponentsInPause() {
  return driverParams.get("pauseAnimateComponents")[0] == "1";
}

function delayExtraAnimateComponents() {
  return 500 * +(!isThereAnimateComponents() || isAnimateComponentsInPause());
}

function drawComponentsAnimate() {
  if (!isAnimateComponentsInPause()) {
    components_animate.forEach((component) => {
      component.msCount += timeSteepRateAnimateComponents;
      let d = component.frameRate;
      const unitRate = 1000 / d;
      if (component.msCount >= unitRate) {
        component.forceUpdate();
        component.msCount %= unitRate;
      }
    });
  }
  setTimeout(
    drawComponentsAnimate,
    timeSteepRateAnimateComponents + delayExtraAnimateComponents()
  );
}
function addAnimateComponent(component) {
  components_animate.push(component);
}
function removeAnimateComponent(component) {
  components_animate.splice(components_animate.indexOf(component), 1);
}

export class AnimateComponent extends Component {
  constructor(props) {
    super(props);
    if (!this.props.frameRate) {
      this.frameRate = 15;
    } else {
      this.frameRate = this.props.frameRate;
    }
    this.initFrameRate = this.frameRate;
    this.msCount = 0;
  }

  componentDidMount() {
    addAnimateComponent(this);
    this.setup && this.setup.bind(this)();
  }

  componentWillUnmount() {
    removeAnimateComponent(this);
  }
}
