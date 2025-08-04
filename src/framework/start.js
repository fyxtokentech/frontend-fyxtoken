function modelNullish({ evalFn = true, nullish = true } = {}) {
  let candidate;
  return F;

  function F(value, ...rest) {
    if (typeof value === "function" && evalFn) {
      value = value();
    }
    if (nullish) {
      if (!isNullish(value)) {
        return value;
      }
    } else {
      if (value) {
        return value;
      } else if (!isNullish(value)) {
        candidate = value;
      }
    }
    if (rest.length > 0) {
      return F(...rest);
    }
    return candidate;
  }
}

export function isNullish(value) {
  return value === null || value === undefined;
}
export const nullish = modelNullish();
export const findFirstTruthy = modelNullish({ nullish: false });
export const nullishFlat = modelNullish({ evalFn: false });

export function assignNullish(dst, src) {
  for (const key in src) {
    dst[key] = nullishFlat(dst[key], src[key]);
  }
  return dst;
}

[global, window].forEach((g) => {
  Object.assign(g, {
    nullish,
    nullishFlat,
    assignNullish,
    findFirstTruthy,
  });
});
