const _startMillis = Date.now();

export function millis() {
  return Date.now() - _startMillis;
}

export function day() {
  return new Date().getDate();
}

export function hour() {
  return new Date().getHours();
}

export function minute() {
  return new Date().getMinutes();
}

export function second() {
  return new Date().getSeconds();
}

export function month() {
  return new Date().getMonth() + 1;
}

export function year() {
  return new Date().getFullYear();
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ellapsed(delay) {
  return Date.now() - delay;
}

export function Delayer(timedelay) {
  let delay = -1;
  let pila = [];
  let equilibrio = 0;

  return new (class {
    setDelay(newTimedelay) {
      timedelay = newTimedelay;
    }

    getDelay() {
      return timedelay;
    }

    isReady(cbIncrement) {
      let ready = ellapsed(delay) >= timedelay;
      cbIncrement && pila.push(cbIncrement);
      if (ready) {
        if (pila.length) {
          if (equilibrio == 0) {
            delay = Date.now();
            pila.pop()();
            pila = [];
          }
        } else {
          delay = Date.now();
        }
      } else {
        if (cbIncrement) {
          equilibrio++;
          setTimeout(() => {
            equilibrio--;
            this.isReady();
          }, timedelay);
        }
      }
      return ready;
    }
  })();
}
