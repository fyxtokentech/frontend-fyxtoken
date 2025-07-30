function modelNullish({ evalFn = true } = {}) {
  return F;

  function F(value, ...rest) {
    if (typeof value === "function" && evalFn) {
      value = value();
    }
    if (!isNullish(value)) {
      return value;
    }
    if (rest.length > 0) {
      return F(...rest);
    }
  }
}

export function isNullish(value){
  return value === null || value === undefined;
}
export const nullish = modelNullish();
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
  });
});
