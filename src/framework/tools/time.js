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
  let id = 0;

  return new (class {
    setDelay(newTimedelay) {
      timedelay = newTimedelay;
    }

    incrementId() {
      id++;
    }

    getId() {
      return id;
    }

    isTheId(id_, reset = false) {
      const isTheId = id == id_;
      if (reset && isTheId) {
        this.resetId();
      }
      return isTheId;
    }

    resetId() {
      id = 0;
    }

    getDelay() {
      return timedelay;
    }

    isReady(cbIncrement = false, id_) {
      const ready = ellapsed(delay) >= timedelay;
      console.log({ ready, id_, id }, this.getId());
      if (ready) {
        if (id_) {
          if (!this.isTheId(id_, true)) {
            return false;
          }
        }
        delay = Date.now();
      } else {
        if (cbIncrement) {
          this.incrementId();
          if (typeof cbIncrement == "function") {
            setTimeout(() => cbIncrement(id), timedelay);
          }
        }
      }
      return ready;
    }
  })();
}
