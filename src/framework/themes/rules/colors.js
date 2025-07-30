import Color from "color";

const _themeColors_ = {};

export function themeColors() {
  return _themeColors_;
}

export function registerColors(colors) {
  Object.assign(_themeColors_, colors);
  Object.assign(window, { themeColors: _themeColors_ });
  return _themeColors_;
}

Object.entries({
  clone: function () {
    return Color(this.hex());
  },
  toLerp: function (color, t = 0) {
    if (!color) {
      return this.clone();
    }
    if (t < 0) {
      return this.toLerp(color.invert(), Math.abs(t));
    }
    return this.mix(color, t);
  },
  toWhite: function (t = 0) {
    return this.toLerp(Color("white"), t);
  },
  toBlack: function (t = 0) {
    return this.toLerp(Color("black"), t);
  },
  toGray: function (t = 0) {
    return this.toLerp(Color("gray"), t);
  },
  invert: function (t = 1) {
    const rgb = this.rgb()
      .array()
      .map((c) => parseInt(255 - c));
    const invert = Color(`rgb(${rgb.join(",")})`);
    return this.toLerp(invert, t);
  },
  invertnohue: function (t = 1) {
    const invert = this.invert().rotate(180);
    return this.toLerp(invert, t);
  },
  hslarray: function () {
    return [
      this.hue(), // H (0–360)
      this.saturationl(), // S (0–100)
      this.lightness(), // L (0–100)
    ];
  },
  hsvarray: function () {
    return [
      this.hue(), // H (0–360)
      this.saturationl(), // S (0–100)
      this.value(), // V (0–100)
    ];
  },
}).forEach(([key, value]) => {
  if (Color.prototype[key]) {
    return;
  }
  Color.prototype[key] = value;
});

export function getPrimaryColors() {
  return {
    red: Color("rgb(255, 0, 0)"),
    darkred: Color("rgb(128, 0, 0)"),
    green: Color("rgb(0, 255, 0)"),
    blue: Color("rgb(0, 0, 255)"),
    yellow: Color("rgb(255, 255, 0)"),
    magenta: Color("rgb(255, 0, 255)"),
    cyan: Color("rgb(0, 255, 255)"),
    tomato: Color("rgb(219, 48, 0)"),
    crimson: Color("rgb(200, 40, 80)"),
    skyGreen: Color("rgb(15, 146, 216)"),
    lemonGreen: Color("rgb(173, 255, 47)"),
    militaryGreen: Color("rgb(26, 128, 0)"),
    aquaBlue: Color("rgb(30, 168, 202)"),
    purple: Color("rgb(128, 0, 128)"),
    springGreen: Color("rgb(19, 200, 132)"),
    white: Color("rgb(255, 255, 255)"),
    black: Color("rgb(0, 0, 0)"),
    blackTheme: Color("rgb(40, 40, 40)"),
    gray: Color("rgb(128, 128, 128)"),
    darkgray: Color("rgb(32, 32, 32)"),
    orange: Color("rgb(200, 128, 0)"),
    pink: Color("rgb(255, 192, 203)"),
    navy: Color("rgb(0, 52, 163)"),
    darkblue: Color("rgb(0, 0, 128)"),
    darkcyan: Color("rgb(0, 64, 64)"),
    darkmagenta: Color("rgb(80, 0, 80)"),
    brown: Color("rgb(143, 52, 0)"),
    violet: Color("rgb(128, 43, 200)"),
    darkviolet: Color("rgb(64, 20, 90)"),
    olive: Color("rgb(128, 150, 0)"),
    amber: Color("rgb(255, 191, 0)"),
  };
}

export function transformColor(color, type, key) {
  switch (type) {
    case "Light":
      return Color(`hsl(${color.hue()}, 100%, 70%)`);
    case "Accent":
      return Color(`hsl(${color.hue()}, 100%, 50%)`);
    case "pair":
      const obj = color;
      const retorno = {
        [key + "Light"]: transformColor(obj[key], "Light", key),
        [key + "Accent"]: transformColor(obj[key], "Accent", key),
      };
      return retorno;
    default:
      return color;
  }
}

export function getSecondaryColors(primary) {
  return {
    ...Object.keys(primary).reduce((acc, key) => {
      acc = {
        ...acc,
        ...transformColor(primary, "pair", key),
      };
      return acc;
    }, {}),
  };
}

export function getAllColors() {
  const primaries = getPrimaryColors();
  return {
    ...primaries,
    ...getSecondaryColors(primaries),
  };
}

export { Color };
